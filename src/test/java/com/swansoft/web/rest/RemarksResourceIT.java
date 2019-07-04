package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Remarks;
import com.swansoft.repository.RemarksRepository;
import com.swansoft.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.swansoft.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link RemarksResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class RemarksResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    @Autowired
    private RemarksRepository remarksRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restRemarksMockMvc;

    private Remarks remarks;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RemarksResource remarksResource = new RemarksResource(remarksRepository);
        this.restRemarksMockMvc = MockMvcBuilders.standaloneSetup(remarksResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remarks createEntity(EntityManager em) {
        Remarks remarks = new Remarks()
            .title(DEFAULT_TITLE);
        return remarks;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remarks createUpdatedEntity(EntityManager em) {
        Remarks remarks = new Remarks()
            .title(UPDATED_TITLE);
        return remarks;
    }

    @BeforeEach
    public void initTest() {
        remarks = createEntity(em);
    }

    @Test
    @Transactional
    public void createRemarks() throws Exception {
        int databaseSizeBeforeCreate = remarksRepository.findAll().size();

        // Create the Remarks
        restRemarksMockMvc.perform(post("/api/remarks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(remarks)))
            .andExpect(status().isCreated());

        // Validate the Remarks in the database
        List<Remarks> remarksList = remarksRepository.findAll();
        assertThat(remarksList).hasSize(databaseSizeBeforeCreate + 1);
        Remarks testRemarks = remarksList.get(remarksList.size() - 1);
        assertThat(testRemarks.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    public void createRemarksWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = remarksRepository.findAll().size();

        // Create the Remarks with an existing ID
        remarks.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRemarksMockMvc.perform(post("/api/remarks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(remarks)))
            .andExpect(status().isBadRequest());

        // Validate the Remarks in the database
        List<Remarks> remarksList = remarksRepository.findAll();
        assertThat(remarksList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllRemarks() throws Exception {
        // Initialize the database
        remarksRepository.saveAndFlush(remarks);

        // Get all the remarksList
        restRemarksMockMvc.perform(get("/api/remarks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(remarks.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())));
    }
    
    @Test
    @Transactional
    public void getRemarks() throws Exception {
        // Initialize the database
        remarksRepository.saveAndFlush(remarks);

        // Get the remarks
        restRemarksMockMvc.perform(get("/api/remarks/{id}", remarks.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(remarks.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRemarks() throws Exception {
        // Get the remarks
        restRemarksMockMvc.perform(get("/api/remarks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRemarks() throws Exception {
        // Initialize the database
        remarksRepository.saveAndFlush(remarks);

        int databaseSizeBeforeUpdate = remarksRepository.findAll().size();

        // Update the remarks
        Remarks updatedRemarks = remarksRepository.findById(remarks.getId()).get();
        // Disconnect from session so that the updates on updatedRemarks are not directly saved in db
        em.detach(updatedRemarks);
        updatedRemarks
            .title(UPDATED_TITLE);

        restRemarksMockMvc.perform(put("/api/remarks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRemarks)))
            .andExpect(status().isOk());

        // Validate the Remarks in the database
        List<Remarks> remarksList = remarksRepository.findAll();
        assertThat(remarksList).hasSize(databaseSizeBeforeUpdate);
        Remarks testRemarks = remarksList.get(remarksList.size() - 1);
        assertThat(testRemarks.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    public void updateNonExistingRemarks() throws Exception {
        int databaseSizeBeforeUpdate = remarksRepository.findAll().size();

        // Create the Remarks

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRemarksMockMvc.perform(put("/api/remarks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(remarks)))
            .andExpect(status().isBadRequest());

        // Validate the Remarks in the database
        List<Remarks> remarksList = remarksRepository.findAll();
        assertThat(remarksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRemarks() throws Exception {
        // Initialize the database
        remarksRepository.saveAndFlush(remarks);

        int databaseSizeBeforeDelete = remarksRepository.findAll().size();

        // Delete the remarks
        restRemarksMockMvc.perform(delete("/api/remarks/{id}", remarks.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Remarks> remarksList = remarksRepository.findAll();
        assertThat(remarksList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Remarks.class);
        Remarks remarks1 = new Remarks();
        remarks1.setId(1L);
        Remarks remarks2 = new Remarks();
        remarks2.setId(remarks1.getId());
        assertThat(remarks1).isEqualTo(remarks2);
        remarks2.setId(2L);
        assertThat(remarks1).isNotEqualTo(remarks2);
        remarks1.setId(null);
        assertThat(remarks1).isNotEqualTo(remarks2);
    }
}
