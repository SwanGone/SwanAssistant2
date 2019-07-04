package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.OriginDetails;
import com.swansoft.repository.OriginDetailsRepository;
import com.swansoft.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
import java.util.ArrayList;
import java.util.List;

import static com.swansoft.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link OriginDetailsResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class OriginDetailsResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private OriginDetailsRepository originDetailsRepository;

    @Mock
    private OriginDetailsRepository originDetailsRepositoryMock;

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

    private MockMvc restOriginDetailsMockMvc;

    private OriginDetails originDetails;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OriginDetailsResource originDetailsResource = new OriginDetailsResource(originDetailsRepository);
        this.restOriginDetailsMockMvc = MockMvcBuilders.standaloneSetup(originDetailsResource)
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
    public static OriginDetails createEntity(EntityManager em) {
        OriginDetails originDetails = new OriginDetails()
            .content(DEFAULT_CONTENT)
            .dateAdded(DEFAULT_DATE_ADDED)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return originDetails;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OriginDetails createUpdatedEntity(EntityManager em) {
        OriginDetails originDetails = new OriginDetails()
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return originDetails;
    }

    @BeforeEach
    public void initTest() {
        originDetails = createEntity(em);
    }

    @Test
    @Transactional
    public void createOriginDetails() throws Exception {
        int databaseSizeBeforeCreate = originDetailsRepository.findAll().size();

        // Create the OriginDetails
        restOriginDetailsMockMvc.perform(post("/api/origin-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(originDetails)))
            .andExpect(status().isCreated());

        // Validate the OriginDetails in the database
        List<OriginDetails> originDetailsList = originDetailsRepository.findAll();
        assertThat(originDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        OriginDetails testOriginDetails = originDetailsList.get(originDetailsList.size() - 1);
        assertThat(testOriginDetails.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testOriginDetails.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testOriginDetails.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createOriginDetailsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = originDetailsRepository.findAll().size();

        // Create the OriginDetails with an existing ID
        originDetails.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOriginDetailsMockMvc.perform(post("/api/origin-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(originDetails)))
            .andExpect(status().isBadRequest());

        // Validate the OriginDetails in the database
        List<OriginDetails> originDetailsList = originDetailsRepository.findAll();
        assertThat(originDetailsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOriginDetails() throws Exception {
        // Initialize the database
        originDetailsRepository.saveAndFlush(originDetails);

        // Get all the originDetailsList
        restOriginDetailsMockMvc.perform(get("/api/origin-details?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(originDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllOriginDetailsWithEagerRelationshipsIsEnabled() throws Exception {
        OriginDetailsResource originDetailsResource = new OriginDetailsResource(originDetailsRepositoryMock);
        when(originDetailsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restOriginDetailsMockMvc = MockMvcBuilders.standaloneSetup(originDetailsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOriginDetailsMockMvc.perform(get("/api/origin-details?eagerload=true"))
        .andExpect(status().isOk());

        verify(originDetailsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllOriginDetailsWithEagerRelationshipsIsNotEnabled() throws Exception {
        OriginDetailsResource originDetailsResource = new OriginDetailsResource(originDetailsRepositoryMock);
            when(originDetailsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restOriginDetailsMockMvc = MockMvcBuilders.standaloneSetup(originDetailsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOriginDetailsMockMvc.perform(get("/api/origin-details?eagerload=true"))
        .andExpect(status().isOk());

            verify(originDetailsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getOriginDetails() throws Exception {
        // Initialize the database
        originDetailsRepository.saveAndFlush(originDetails);

        // Get the originDetails
        restOriginDetailsMockMvc.perform(get("/api/origin-details/{id}", originDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(originDetails.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOriginDetails() throws Exception {
        // Get the originDetails
        restOriginDetailsMockMvc.perform(get("/api/origin-details/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOriginDetails() throws Exception {
        // Initialize the database
        originDetailsRepository.saveAndFlush(originDetails);

        int databaseSizeBeforeUpdate = originDetailsRepository.findAll().size();

        // Update the originDetails
        OriginDetails updatedOriginDetails = originDetailsRepository.findById(originDetails.getId()).get();
        // Disconnect from session so that the updates on updatedOriginDetails are not directly saved in db
        em.detach(updatedOriginDetails);
        updatedOriginDetails
            .content(UPDATED_CONTENT)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restOriginDetailsMockMvc.perform(put("/api/origin-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOriginDetails)))
            .andExpect(status().isOk());

        // Validate the OriginDetails in the database
        List<OriginDetails> originDetailsList = originDetailsRepository.findAll();
        assertThat(originDetailsList).hasSize(databaseSizeBeforeUpdate);
        OriginDetails testOriginDetails = originDetailsList.get(originDetailsList.size() - 1);
        assertThat(testOriginDetails.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testOriginDetails.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testOriginDetails.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingOriginDetails() throws Exception {
        int databaseSizeBeforeUpdate = originDetailsRepository.findAll().size();

        // Create the OriginDetails

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOriginDetailsMockMvc.perform(put("/api/origin-details")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(originDetails)))
            .andExpect(status().isBadRequest());

        // Validate the OriginDetails in the database
        List<OriginDetails> originDetailsList = originDetailsRepository.findAll();
        assertThat(originDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOriginDetails() throws Exception {
        // Initialize the database
        originDetailsRepository.saveAndFlush(originDetails);

        int databaseSizeBeforeDelete = originDetailsRepository.findAll().size();

        // Delete the originDetails
        restOriginDetailsMockMvc.perform(delete("/api/origin-details/{id}", originDetails.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OriginDetails> originDetailsList = originDetailsRepository.findAll();
        assertThat(originDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OriginDetails.class);
        OriginDetails originDetails1 = new OriginDetails();
        originDetails1.setId(1L);
        OriginDetails originDetails2 = new OriginDetails();
        originDetails2.setId(originDetails1.getId());
        assertThat(originDetails1).isEqualTo(originDetails2);
        originDetails2.setId(2L);
        assertThat(originDetails1).isNotEqualTo(originDetails2);
        originDetails1.setId(null);
        assertThat(originDetails1).isNotEqualTo(originDetails2);
    }
}
