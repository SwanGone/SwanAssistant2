package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Species;
import com.swansoft.repository.SpeciesRepository;
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
 * Integration tests for the {@Link SpeciesResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class SpeciesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHYSICAL_CHARACTERISTICS = "AAAAAAAAAA";
    private static final String UPDATED_PHYSICAL_CHARACTERISTICS = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private SpeciesRepository speciesRepository;

    @Mock
    private SpeciesRepository speciesRepositoryMock;

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

    private MockMvc restSpeciesMockMvc;

    private Species species;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SpeciesResource speciesResource = new SpeciesResource(speciesRepository);
        this.restSpeciesMockMvc = MockMvcBuilders.standaloneSetup(speciesResource)
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
    public static Species createEntity(EntityManager em) {
        Species species = new Species()
            .name(DEFAULT_NAME)
            .physicalCharacteristics(DEFAULT_PHYSICAL_CHARACTERISTICS)
            .dateAdded(DEFAULT_DATE_ADDED)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return species;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Species createUpdatedEntity(EntityManager em) {
        Species species = new Species()
            .name(UPDATED_NAME)
            .physicalCharacteristics(UPDATED_PHYSICAL_CHARACTERISTICS)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return species;
    }

    @BeforeEach
    public void initTest() {
        species = createEntity(em);
    }

    @Test
    @Transactional
    public void createSpecies() throws Exception {
        int databaseSizeBeforeCreate = speciesRepository.findAll().size();

        // Create the Species
        restSpeciesMockMvc.perform(post("/api/species")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(species)))
            .andExpect(status().isCreated());

        // Validate the Species in the database
        List<Species> speciesList = speciesRepository.findAll();
        assertThat(speciesList).hasSize(databaseSizeBeforeCreate + 1);
        Species testSpecies = speciesList.get(speciesList.size() - 1);
        assertThat(testSpecies.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSpecies.getPhysicalCharacteristics()).isEqualTo(DEFAULT_PHYSICAL_CHARACTERISTICS);
        assertThat(testSpecies.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testSpecies.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createSpeciesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = speciesRepository.findAll().size();

        // Create the Species with an existing ID
        species.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSpeciesMockMvc.perform(post("/api/species")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(species)))
            .andExpect(status().isBadRequest());

        // Validate the Species in the database
        List<Species> speciesList = speciesRepository.findAll();
        assertThat(speciesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllSpecies() throws Exception {
        // Initialize the database
        speciesRepository.saveAndFlush(species);

        // Get all the speciesList
        restSpeciesMockMvc.perform(get("/api/species?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(species.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].physicalCharacteristics").value(hasItem(DEFAULT_PHYSICAL_CHARACTERISTICS.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllSpeciesWithEagerRelationshipsIsEnabled() throws Exception {
        SpeciesResource speciesResource = new SpeciesResource(speciesRepositoryMock);
        when(speciesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restSpeciesMockMvc = MockMvcBuilders.standaloneSetup(speciesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSpeciesMockMvc.perform(get("/api/species?eagerload=true"))
        .andExpect(status().isOk());

        verify(speciesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllSpeciesWithEagerRelationshipsIsNotEnabled() throws Exception {
        SpeciesResource speciesResource = new SpeciesResource(speciesRepositoryMock);
            when(speciesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restSpeciesMockMvc = MockMvcBuilders.standaloneSetup(speciesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSpeciesMockMvc.perform(get("/api/species?eagerload=true"))
        .andExpect(status().isOk());

            verify(speciesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getSpecies() throws Exception {
        // Initialize the database
        speciesRepository.saveAndFlush(species);

        // Get the species
        restSpeciesMockMvc.perform(get("/api/species/{id}", species.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(species.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.physicalCharacteristics").value(DEFAULT_PHYSICAL_CHARACTERISTICS.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSpecies() throws Exception {
        // Get the species
        restSpeciesMockMvc.perform(get("/api/species/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSpecies() throws Exception {
        // Initialize the database
        speciesRepository.saveAndFlush(species);

        int databaseSizeBeforeUpdate = speciesRepository.findAll().size();

        // Update the species
        Species updatedSpecies = speciesRepository.findById(species.getId()).get();
        // Disconnect from session so that the updates on updatedSpecies are not directly saved in db
        em.detach(updatedSpecies);
        updatedSpecies
            .name(UPDATED_NAME)
            .physicalCharacteristics(UPDATED_PHYSICAL_CHARACTERISTICS)
            .dateAdded(UPDATED_DATE_ADDED)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restSpeciesMockMvc.perform(put("/api/species")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSpecies)))
            .andExpect(status().isOk());

        // Validate the Species in the database
        List<Species> speciesList = speciesRepository.findAll();
        assertThat(speciesList).hasSize(databaseSizeBeforeUpdate);
        Species testSpecies = speciesList.get(speciesList.size() - 1);
        assertThat(testSpecies.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSpecies.getPhysicalCharacteristics()).isEqualTo(UPDATED_PHYSICAL_CHARACTERISTICS);
        assertThat(testSpecies.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testSpecies.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingSpecies() throws Exception {
        int databaseSizeBeforeUpdate = speciesRepository.findAll().size();

        // Create the Species

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSpeciesMockMvc.perform(put("/api/species")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(species)))
            .andExpect(status().isBadRequest());

        // Validate the Species in the database
        List<Species> speciesList = speciesRepository.findAll();
        assertThat(speciesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSpecies() throws Exception {
        // Initialize the database
        speciesRepository.saveAndFlush(species);

        int databaseSizeBeforeDelete = speciesRepository.findAll().size();

        // Delete the species
        restSpeciesMockMvc.perform(delete("/api/species/{id}", species.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Species> speciesList = speciesRepository.findAll();
        assertThat(speciesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Species.class);
        Species species1 = new Species();
        species1.setId(1L);
        Species species2 = new Species();
        species2.setId(species1.getId());
        assertThat(species1).isEqualTo(species2);
        species2.setId(2L);
        assertThat(species1).isNotEqualTo(species2);
        species1.setId(null);
        assertThat(species1).isNotEqualTo(species2);
    }
}
