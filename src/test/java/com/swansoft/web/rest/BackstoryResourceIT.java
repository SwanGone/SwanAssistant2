package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Backstory;
import com.swansoft.repository.BackstoryRepository;
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
 * Integration tests for the {@Link BackstoryResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class BackstoryResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    @Autowired
    private BackstoryRepository backstoryRepository;

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

    private MockMvc restBackstoryMockMvc;

    private Backstory backstory;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BackstoryResource backstoryResource = new BackstoryResource(backstoryRepository);
        this.restBackstoryMockMvc = MockMvcBuilders.standaloneSetup(backstoryResource)
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
    public static Backstory createEntity(EntityManager em) {
        Backstory backstory = new Backstory()
            .text(DEFAULT_TEXT);
        return backstory;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Backstory createUpdatedEntity(EntityManager em) {
        Backstory backstory = new Backstory()
            .text(UPDATED_TEXT);
        return backstory;
    }

    @BeforeEach
    public void initTest() {
        backstory = createEntity(em);
    }

    @Test
    @Transactional
    public void createBackstory() throws Exception {
        int databaseSizeBeforeCreate = backstoryRepository.findAll().size();

        // Create the Backstory
        restBackstoryMockMvc.perform(post("/api/backstories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(backstory)))
            .andExpect(status().isCreated());

        // Validate the Backstory in the database
        List<Backstory> backstoryList = backstoryRepository.findAll();
        assertThat(backstoryList).hasSize(databaseSizeBeforeCreate + 1);
        Backstory testBackstory = backstoryList.get(backstoryList.size() - 1);
        assertThat(testBackstory.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    public void createBackstoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = backstoryRepository.findAll().size();

        // Create the Backstory with an existing ID
        backstory.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBackstoryMockMvc.perform(post("/api/backstories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(backstory)))
            .andExpect(status().isBadRequest());

        // Validate the Backstory in the database
        List<Backstory> backstoryList = backstoryRepository.findAll();
        assertThat(backstoryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllBackstories() throws Exception {
        // Initialize the database
        backstoryRepository.saveAndFlush(backstory);

        // Get all the backstoryList
        restBackstoryMockMvc.perform(get("/api/backstories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(backstory.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())));
    }
    
    @Test
    @Transactional
    public void getBackstory() throws Exception {
        // Initialize the database
        backstoryRepository.saveAndFlush(backstory);

        // Get the backstory
        restBackstoryMockMvc.perform(get("/api/backstories/{id}", backstory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(backstory.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingBackstory() throws Exception {
        // Get the backstory
        restBackstoryMockMvc.perform(get("/api/backstories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBackstory() throws Exception {
        // Initialize the database
        backstoryRepository.saveAndFlush(backstory);

        int databaseSizeBeforeUpdate = backstoryRepository.findAll().size();

        // Update the backstory
        Backstory updatedBackstory = backstoryRepository.findById(backstory.getId()).get();
        // Disconnect from session so that the updates on updatedBackstory are not directly saved in db
        em.detach(updatedBackstory);
        updatedBackstory
            .text(UPDATED_TEXT);

        restBackstoryMockMvc.perform(put("/api/backstories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBackstory)))
            .andExpect(status().isOk());

        // Validate the Backstory in the database
        List<Backstory> backstoryList = backstoryRepository.findAll();
        assertThat(backstoryList).hasSize(databaseSizeBeforeUpdate);
        Backstory testBackstory = backstoryList.get(backstoryList.size() - 1);
        assertThat(testBackstory.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    public void updateNonExistingBackstory() throws Exception {
        int databaseSizeBeforeUpdate = backstoryRepository.findAll().size();

        // Create the Backstory

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBackstoryMockMvc.perform(put("/api/backstories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(backstory)))
            .andExpect(status().isBadRequest());

        // Validate the Backstory in the database
        List<Backstory> backstoryList = backstoryRepository.findAll();
        assertThat(backstoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBackstory() throws Exception {
        // Initialize the database
        backstoryRepository.saveAndFlush(backstory);

        int databaseSizeBeforeDelete = backstoryRepository.findAll().size();

        // Delete the backstory
        restBackstoryMockMvc.perform(delete("/api/backstories/{id}", backstory.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Backstory> backstoryList = backstoryRepository.findAll();
        assertThat(backstoryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Backstory.class);
        Backstory backstory1 = new Backstory();
        backstory1.setId(1L);
        Backstory backstory2 = new Backstory();
        backstory2.setId(backstory1.getId());
        assertThat(backstory1).isEqualTo(backstory2);
        backstory2.setId(2L);
        assertThat(backstory1).isNotEqualTo(backstory2);
        backstory1.setId(null);
        assertThat(backstory1).isNotEqualTo(backstory2);
    }
}
