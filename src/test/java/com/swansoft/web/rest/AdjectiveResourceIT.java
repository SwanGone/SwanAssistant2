package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Adjective;
import com.swansoft.repository.AdjectiveRepository;
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
 * Integration tests for the {@Link AdjectiveResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class AdjectiveResourceIT {

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private AdjectiveRepository adjectiveRepository;

    @Mock
    private AdjectiveRepository adjectiveRepositoryMock;

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

    private MockMvc restAdjectiveMockMvc;

    private Adjective adjective;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AdjectiveResource adjectiveResource = new AdjectiveResource(adjectiveRepository);
        this.restAdjectiveMockMvc = MockMvcBuilders.standaloneSetup(adjectiveResource)
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
    public static Adjective createEntity(EntityManager em) {
        Adjective adjective = new Adjective()
            .dateAdded(DEFAULT_DATE_ADDED)
            .content(DEFAULT_CONTENT)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return adjective;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Adjective createUpdatedEntity(EntityManager em) {
        Adjective adjective = new Adjective()
            .dateAdded(UPDATED_DATE_ADDED)
            .content(UPDATED_CONTENT)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return adjective;
    }

    @BeforeEach
    public void initTest() {
        adjective = createEntity(em);
    }

    @Test
    @Transactional
    public void createAdjective() throws Exception {
        int databaseSizeBeforeCreate = adjectiveRepository.findAll().size();

        // Create the Adjective
        restAdjectiveMockMvc.perform(post("/api/adjectives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(adjective)))
            .andExpect(status().isCreated());

        // Validate the Adjective in the database
        List<Adjective> adjectiveList = adjectiveRepository.findAll();
        assertThat(adjectiveList).hasSize(databaseSizeBeforeCreate + 1);
        Adjective testAdjective = adjectiveList.get(adjectiveList.size() - 1);
        assertThat(testAdjective.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testAdjective.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testAdjective.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createAdjectiveWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = adjectiveRepository.findAll().size();

        // Create the Adjective with an existing ID
        adjective.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdjectiveMockMvc.perform(post("/api/adjectives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(adjective)))
            .andExpect(status().isBadRequest());

        // Validate the Adjective in the database
        List<Adjective> adjectiveList = adjectiveRepository.findAll();
        assertThat(adjectiveList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllAdjectives() throws Exception {
        // Initialize the database
        adjectiveRepository.saveAndFlush(adjective);

        // Get all the adjectiveList
        restAdjectiveMockMvc.perform(get("/api/adjectives?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adjective.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllAdjectivesWithEagerRelationshipsIsEnabled() throws Exception {
        AdjectiveResource adjectiveResource = new AdjectiveResource(adjectiveRepositoryMock);
        when(adjectiveRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restAdjectiveMockMvc = MockMvcBuilders.standaloneSetup(adjectiveResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restAdjectiveMockMvc.perform(get("/api/adjectives?eagerload=true"))
        .andExpect(status().isOk());

        verify(adjectiveRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllAdjectivesWithEagerRelationshipsIsNotEnabled() throws Exception {
        AdjectiveResource adjectiveResource = new AdjectiveResource(adjectiveRepositoryMock);
            when(adjectiveRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restAdjectiveMockMvc = MockMvcBuilders.standaloneSetup(adjectiveResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restAdjectiveMockMvc.perform(get("/api/adjectives?eagerload=true"))
        .andExpect(status().isOk());

            verify(adjectiveRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getAdjective() throws Exception {
        // Initialize the database
        adjectiveRepository.saveAndFlush(adjective);

        // Get the adjective
        restAdjectiveMockMvc.perform(get("/api/adjectives/{id}", adjective.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(adjective.getId().intValue()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAdjective() throws Exception {
        // Get the adjective
        restAdjectiveMockMvc.perform(get("/api/adjectives/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAdjective() throws Exception {
        // Initialize the database
        adjectiveRepository.saveAndFlush(adjective);

        int databaseSizeBeforeUpdate = adjectiveRepository.findAll().size();

        // Update the adjective
        Adjective updatedAdjective = adjectiveRepository.findById(adjective.getId()).get();
        // Disconnect from session so that the updates on updatedAdjective are not directly saved in db
        em.detach(updatedAdjective);
        updatedAdjective
            .dateAdded(UPDATED_DATE_ADDED)
            .content(UPDATED_CONTENT)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restAdjectiveMockMvc.perform(put("/api/adjectives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAdjective)))
            .andExpect(status().isOk());

        // Validate the Adjective in the database
        List<Adjective> adjectiveList = adjectiveRepository.findAll();
        assertThat(adjectiveList).hasSize(databaseSizeBeforeUpdate);
        Adjective testAdjective = adjectiveList.get(adjectiveList.size() - 1);
        assertThat(testAdjective.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testAdjective.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testAdjective.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingAdjective() throws Exception {
        int databaseSizeBeforeUpdate = adjectiveRepository.findAll().size();

        // Create the Adjective

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdjectiveMockMvc.perform(put("/api/adjectives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(adjective)))
            .andExpect(status().isBadRequest());

        // Validate the Adjective in the database
        List<Adjective> adjectiveList = adjectiveRepository.findAll();
        assertThat(adjectiveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAdjective() throws Exception {
        // Initialize the database
        adjectiveRepository.saveAndFlush(adjective);

        int databaseSizeBeforeDelete = adjectiveRepository.findAll().size();

        // Delete the adjective
        restAdjectiveMockMvc.perform(delete("/api/adjectives/{id}", adjective.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Adjective> adjectiveList = adjectiveRepository.findAll();
        assertThat(adjectiveList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Adjective.class);
        Adjective adjective1 = new Adjective();
        adjective1.setId(1L);
        Adjective adjective2 = new Adjective();
        adjective2.setId(adjective1.getId());
        assertThat(adjective1).isEqualTo(adjective2);
        adjective2.setId(2L);
        assertThat(adjective1).isNotEqualTo(adjective2);
        adjective1.setId(null);
        assertThat(adjective1).isNotEqualTo(adjective2);
    }
}
