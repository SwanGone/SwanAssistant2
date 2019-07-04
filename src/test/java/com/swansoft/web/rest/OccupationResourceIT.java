package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Occupation;
import com.swansoft.repository.OccupationRepository;
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
 * Integration tests for the {@Link OccupationResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class OccupationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private OccupationRepository occupationRepository;

    @Mock
    private OccupationRepository occupationRepositoryMock;

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

    private MockMvc restOccupationMockMvc;

    private Occupation occupation;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OccupationResource occupationResource = new OccupationResource(occupationRepository);
        this.restOccupationMockMvc = MockMvcBuilders.standaloneSetup(occupationResource)
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
    public static Occupation createEntity(EntityManager em) {
        Occupation occupation = new Occupation()
            .name(DEFAULT_NAME)
            .dateAdded(DEFAULT_DATE_ADDED)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return occupation;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Occupation createUpdatedEntity(EntityManager em) {
        Occupation occupation = new Occupation()
            .name(UPDATED_NAME)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return occupation;
    }

    @BeforeEach
    public void initTest() {
        occupation = createEntity(em);
    }

    @Test
    @Transactional
    public void createOccupation() throws Exception {
        int databaseSizeBeforeCreate = occupationRepository.findAll().size();

        // Create the Occupation
        restOccupationMockMvc.perform(post("/api/occupations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(occupation)))
            .andExpect(status().isCreated());

        // Validate the Occupation in the database
        List<Occupation> occupationList = occupationRepository.findAll();
        assertThat(occupationList).hasSize(databaseSizeBeforeCreate + 1);
        Occupation testOccupation = occupationList.get(occupationList.size() - 1);
        assertThat(testOccupation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testOccupation.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testOccupation.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createOccupationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = occupationRepository.findAll().size();

        // Create the Occupation with an existing ID
        occupation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOccupationMockMvc.perform(post("/api/occupations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(occupation)))
            .andExpect(status().isBadRequest());

        // Validate the Occupation in the database
        List<Occupation> occupationList = occupationRepository.findAll();
        assertThat(occupationList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOccupations() throws Exception {
        // Initialize the database
        occupationRepository.saveAndFlush(occupation);

        // Get all the occupationList
        restOccupationMockMvc.perform(get("/api/occupations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(occupation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllOccupationsWithEagerRelationshipsIsEnabled() throws Exception {
        OccupationResource occupationResource = new OccupationResource(occupationRepositoryMock);
        when(occupationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restOccupationMockMvc = MockMvcBuilders.standaloneSetup(occupationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOccupationMockMvc.perform(get("/api/occupations?eagerload=true"))
        .andExpect(status().isOk());

        verify(occupationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllOccupationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        OccupationResource occupationResource = new OccupationResource(occupationRepositoryMock);
            when(occupationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restOccupationMockMvc = MockMvcBuilders.standaloneSetup(occupationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restOccupationMockMvc.perform(get("/api/occupations?eagerload=true"))
        .andExpect(status().isOk());

            verify(occupationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getOccupation() throws Exception {
        // Initialize the database
        occupationRepository.saveAndFlush(occupation);

        // Get the occupation
        restOccupationMockMvc.perform(get("/api/occupations/{id}", occupation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(occupation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOccupation() throws Exception {
        // Get the occupation
        restOccupationMockMvc.perform(get("/api/occupations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOccupation() throws Exception {
        // Initialize the database
        occupationRepository.saveAndFlush(occupation);

        int databaseSizeBeforeUpdate = occupationRepository.findAll().size();

        // Update the occupation
        Occupation updatedOccupation = occupationRepository.findById(occupation.getId()).get();
        // Disconnect from session so that the updates on updatedOccupation are not directly saved in db
        em.detach(updatedOccupation);
        updatedOccupation
            .name(UPDATED_NAME)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restOccupationMockMvc.perform(put("/api/occupations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOccupation)))
            .andExpect(status().isOk());

        // Validate the Occupation in the database
        List<Occupation> occupationList = occupationRepository.findAll();
        assertThat(occupationList).hasSize(databaseSizeBeforeUpdate);
        Occupation testOccupation = occupationList.get(occupationList.size() - 1);
        assertThat(testOccupation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testOccupation.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testOccupation.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingOccupation() throws Exception {
        int databaseSizeBeforeUpdate = occupationRepository.findAll().size();

        // Create the Occupation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOccupationMockMvc.perform(put("/api/occupations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(occupation)))
            .andExpect(status().isBadRequest());

        // Validate the Occupation in the database
        List<Occupation> occupationList = occupationRepository.findAll();
        assertThat(occupationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOccupation() throws Exception {
        // Initialize the database
        occupationRepository.saveAndFlush(occupation);

        int databaseSizeBeforeDelete = occupationRepository.findAll().size();

        // Delete the occupation
        restOccupationMockMvc.perform(delete("/api/occupations/{id}", occupation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Occupation> occupationList = occupationRepository.findAll();
        assertThat(occupationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Occupation.class);
        Occupation occupation1 = new Occupation();
        occupation1.setId(1L);
        Occupation occupation2 = new Occupation();
        occupation2.setId(occupation1.getId());
        assertThat(occupation1).isEqualTo(occupation2);
        occupation2.setId(2L);
        assertThat(occupation1).isNotEqualTo(occupation2);
        occupation1.setId(null);
        assertThat(occupation1).isNotEqualTo(occupation2);
    }
}
