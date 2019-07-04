package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Planet;
import com.swansoft.repository.PlanetRepository;
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
 * Integration tests for the {@Link PlanetResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class PlanetResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_HAS_UNOBTAINIUM = false;
    private static final Boolean UPDATED_HAS_UNOBTAINIUM = true;

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private PlanetRepository planetRepository;

    @Mock
    private PlanetRepository planetRepositoryMock;

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

    private MockMvc restPlanetMockMvc;

    private Planet planet;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PlanetResource planetResource = new PlanetResource(planetRepository);
        this.restPlanetMockMvc = MockMvcBuilders.standaloneSetup(planetResource)
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
    public static Planet createEntity(EntityManager em) {
        Planet planet = new Planet()
            .name(DEFAULT_NAME)
            .dateAdded(DEFAULT_DATE_ADDED)
            .hasUnobtainium(DEFAULT_HAS_UNOBTAINIUM)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return planet;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Planet createUpdatedEntity(EntityManager em) {
        Planet planet = new Planet()
            .name(UPDATED_NAME)
            .dateAdded(UPDATED_DATE_ADDED)
            .hasUnobtainium(UPDATED_HAS_UNOBTAINIUM)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return planet;
    }

    @BeforeEach
    public void initTest() {
        planet = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlanet() throws Exception {
        int databaseSizeBeforeCreate = planetRepository.findAll().size();

        // Create the Planet
        restPlanetMockMvc.perform(post("/api/planets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(planet)))
            .andExpect(status().isCreated());

        // Validate the Planet in the database
        List<Planet> planetList = planetRepository.findAll();
        assertThat(planetList).hasSize(databaseSizeBeforeCreate + 1);
        Planet testPlanet = planetList.get(planetList.size() - 1);
        assertThat(testPlanet.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlanet.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testPlanet.isHasUnobtainium()).isEqualTo(DEFAULT_HAS_UNOBTAINIUM);
        assertThat(testPlanet.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createPlanetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = planetRepository.findAll().size();

        // Create the Planet with an existing ID
        planet.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlanetMockMvc.perform(post("/api/planets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(planet)))
            .andExpect(status().isBadRequest());

        // Validate the Planet in the database
        List<Planet> planetList = planetRepository.findAll();
        assertThat(planetList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPlanets() throws Exception {
        // Initialize the database
        planetRepository.saveAndFlush(planet);

        // Get all the planetList
        restPlanetMockMvc.perform(get("/api/planets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(planet.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].hasUnobtainium").value(hasItem(DEFAULT_HAS_UNOBTAINIUM.booleanValue())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllPlanetsWithEagerRelationshipsIsEnabled() throws Exception {
        PlanetResource planetResource = new PlanetResource(planetRepositoryMock);
        when(planetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restPlanetMockMvc = MockMvcBuilders.standaloneSetup(planetResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restPlanetMockMvc.perform(get("/api/planets?eagerload=true"))
        .andExpect(status().isOk());

        verify(planetRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllPlanetsWithEagerRelationshipsIsNotEnabled() throws Exception {
        PlanetResource planetResource = new PlanetResource(planetRepositoryMock);
            when(planetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restPlanetMockMvc = MockMvcBuilders.standaloneSetup(planetResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restPlanetMockMvc.perform(get("/api/planets?eagerload=true"))
        .andExpect(status().isOk());

            verify(planetRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getPlanet() throws Exception {
        // Initialize the database
        planetRepository.saveAndFlush(planet);

        // Get the planet
        restPlanetMockMvc.perform(get("/api/planets/{id}", planet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(planet.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.hasUnobtainium").value(DEFAULT_HAS_UNOBTAINIUM.booleanValue()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPlanet() throws Exception {
        // Get the planet
        restPlanetMockMvc.perform(get("/api/planets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlanet() throws Exception {
        // Initialize the database
        planetRepository.saveAndFlush(planet);

        int databaseSizeBeforeUpdate = planetRepository.findAll().size();

        // Update the planet
        Planet updatedPlanet = planetRepository.findById(planet.getId()).get();
        // Disconnect from session so that the updates on updatedPlanet are not directly saved in db
        em.detach(updatedPlanet);
        updatedPlanet
            .name(UPDATED_NAME)
            .dateAdded(UPDATED_DATE_ADDED)
            .hasUnobtainium(UPDATED_HAS_UNOBTAINIUM)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restPlanetMockMvc.perform(put("/api/planets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlanet)))
            .andExpect(status().isOk());

        // Validate the Planet in the database
        List<Planet> planetList = planetRepository.findAll();
        assertThat(planetList).hasSize(databaseSizeBeforeUpdate);
        Planet testPlanet = planetList.get(planetList.size() - 1);
        assertThat(testPlanet.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlanet.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testPlanet.isHasUnobtainium()).isEqualTo(UPDATED_HAS_UNOBTAINIUM);
        assertThat(testPlanet.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingPlanet() throws Exception {
        int databaseSizeBeforeUpdate = planetRepository.findAll().size();

        // Create the Planet

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanetMockMvc.perform(put("/api/planets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(planet)))
            .andExpect(status().isBadRequest());

        // Validate the Planet in the database
        List<Planet> planetList = planetRepository.findAll();
        assertThat(planetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePlanet() throws Exception {
        // Initialize the database
        planetRepository.saveAndFlush(planet);

        int databaseSizeBeforeDelete = planetRepository.findAll().size();

        // Delete the planet
        restPlanetMockMvc.perform(delete("/api/planets/{id}", planet.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Planet> planetList = planetRepository.findAll();
        assertThat(planetList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Planet.class);
        Planet planet1 = new Planet();
        planet1.setId(1L);
        Planet planet2 = new Planet();
        planet2.setId(planet1.getId());
        assertThat(planet1).isEqualTo(planet2);
        planet2.setId(2L);
        assertThat(planet1).isNotEqualTo(planet2);
        planet1.setId(null);
        assertThat(planet1).isNotEqualTo(planet2);
    }
}
