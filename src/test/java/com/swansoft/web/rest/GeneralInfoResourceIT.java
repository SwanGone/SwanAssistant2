package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.GeneralInfo;
import com.swansoft.repository.GeneralInfoRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.swansoft.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link GeneralInfoResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class GeneralInfoResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private GeneralInfoRepository generalInfoRepository;

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

    private MockMvc restGeneralInfoMockMvc;

    private GeneralInfo generalInfo;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GeneralInfoResource generalInfoResource = new GeneralInfoResource(generalInfoRepository);
        this.restGeneralInfoMockMvc = MockMvcBuilders.standaloneSetup(generalInfoResource)
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
    public static GeneralInfo createEntity(EntityManager em) {
        GeneralInfo generalInfo = new GeneralInfo()
            .content(DEFAULT_CONTENT)
            .dateAdded(DEFAULT_DATE_ADDED);
        return generalInfo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GeneralInfo createUpdatedEntity(EntityManager em) {
        GeneralInfo generalInfo = new GeneralInfo()
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);
        return generalInfo;
    }

    @BeforeEach
    public void initTest() {
        generalInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createGeneralInfo() throws Exception {
        int databaseSizeBeforeCreate = generalInfoRepository.findAll().size();

        // Create the GeneralInfo
        restGeneralInfoMockMvc.perform(post("/api/general-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(generalInfo)))
            .andExpect(status().isCreated());

        // Validate the GeneralInfo in the database
        List<GeneralInfo> generalInfoList = generalInfoRepository.findAll();
        assertThat(generalInfoList).hasSize(databaseSizeBeforeCreate + 1);
        GeneralInfo testGeneralInfo = generalInfoList.get(generalInfoList.size() - 1);
        assertThat(testGeneralInfo.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testGeneralInfo.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
    }

    @Test
    @Transactional
    public void createGeneralInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = generalInfoRepository.findAll().size();

        // Create the GeneralInfo with an existing ID
        generalInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGeneralInfoMockMvc.perform(post("/api/general-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(generalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the GeneralInfo in the database
        List<GeneralInfo> generalInfoList = generalInfoRepository.findAll();
        assertThat(generalInfoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGeneralInfos() throws Exception {
        // Initialize the database
        generalInfoRepository.saveAndFlush(generalInfo);

        // Get all the generalInfoList
        restGeneralInfoMockMvc.perform(get("/api/general-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(generalInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())));
    }
    
    @Test
    @Transactional
    public void getGeneralInfo() throws Exception {
        // Initialize the database
        generalInfoRepository.saveAndFlush(generalInfo);

        // Get the generalInfo
        restGeneralInfoMockMvc.perform(get("/api/general-infos/{id}", generalInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(generalInfo.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGeneralInfo() throws Exception {
        // Get the generalInfo
        restGeneralInfoMockMvc.perform(get("/api/general-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGeneralInfo() throws Exception {
        // Initialize the database
        generalInfoRepository.saveAndFlush(generalInfo);

        int databaseSizeBeforeUpdate = generalInfoRepository.findAll().size();

        // Update the generalInfo
        GeneralInfo updatedGeneralInfo = generalInfoRepository.findById(generalInfo.getId()).get();
        // Disconnect from session so that the updates on updatedGeneralInfo are not directly saved in db
        em.detach(updatedGeneralInfo);
        updatedGeneralInfo
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED);

        restGeneralInfoMockMvc.perform(put("/api/general-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGeneralInfo)))
            .andExpect(status().isOk());

        // Validate the GeneralInfo in the database
        List<GeneralInfo> generalInfoList = generalInfoRepository.findAll();
        assertThat(generalInfoList).hasSize(databaseSizeBeforeUpdate);
        GeneralInfo testGeneralInfo = generalInfoList.get(generalInfoList.size() - 1);
        assertThat(testGeneralInfo.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testGeneralInfo.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
    }

    @Test
    @Transactional
    public void updateNonExistingGeneralInfo() throws Exception {
        int databaseSizeBeforeUpdate = generalInfoRepository.findAll().size();

        // Create the GeneralInfo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGeneralInfoMockMvc.perform(put("/api/general-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(generalInfo)))
            .andExpect(status().isBadRequest());

        // Validate the GeneralInfo in the database
        List<GeneralInfo> generalInfoList = generalInfoRepository.findAll();
        assertThat(generalInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGeneralInfo() throws Exception {
        // Initialize the database
        generalInfoRepository.saveAndFlush(generalInfo);

        int databaseSizeBeforeDelete = generalInfoRepository.findAll().size();

        // Delete the generalInfo
        restGeneralInfoMockMvc.perform(delete("/api/general-infos/{id}", generalInfo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GeneralInfo> generalInfoList = generalInfoRepository.findAll();
        assertThat(generalInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GeneralInfo.class);
        GeneralInfo generalInfo1 = new GeneralInfo();
        generalInfo1.setId(1L);
        GeneralInfo generalInfo2 = new GeneralInfo();
        generalInfo2.setId(generalInfo1.getId());
        assertThat(generalInfo1).isEqualTo(generalInfo2);
        generalInfo2.setId(2L);
        assertThat(generalInfo1).isNotEqualTo(generalInfo2);
        generalInfo1.setId(null);
        assertThat(generalInfo1).isNotEqualTo(generalInfo2);
    }
}
