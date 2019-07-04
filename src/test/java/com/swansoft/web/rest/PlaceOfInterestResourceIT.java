package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.PlaceOfInterest;
import com.swansoft.repository.PlaceOfInterestRepository;
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
 * Integration tests for the {@Link PlaceOfInterestResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class PlaceOfInterestResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    @Autowired
    private PlaceOfInterestRepository placeOfInterestRepository;

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

    private MockMvc restPlaceOfInterestMockMvc;

    private PlaceOfInterest placeOfInterest;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PlaceOfInterestResource placeOfInterestResource = new PlaceOfInterestResource(placeOfInterestRepository);
        this.restPlaceOfInterestMockMvc = MockMvcBuilders.standaloneSetup(placeOfInterestResource)
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
    public static PlaceOfInterest createEntity(EntityManager em) {
        PlaceOfInterest placeOfInterest = new PlaceOfInterest()
            .name(DEFAULT_NAME)
            .inCirculation(DEFAULT_IN_CIRCULATION);
        return placeOfInterest;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaceOfInterest createUpdatedEntity(EntityManager em) {
        PlaceOfInterest placeOfInterest = new PlaceOfInterest()
            .name(UPDATED_NAME)
            .inCirculation(UPDATED_IN_CIRCULATION);
        return placeOfInterest;
    }

    @BeforeEach
    public void initTest() {
        placeOfInterest = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlaceOfInterest() throws Exception {
        int databaseSizeBeforeCreate = placeOfInterestRepository.findAll().size();

        // Create the PlaceOfInterest
        restPlaceOfInterestMockMvc.perform(post("/api/place-of-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfInterest)))
            .andExpect(status().isCreated());

        // Validate the PlaceOfInterest in the database
        List<PlaceOfInterest> placeOfInterestList = placeOfInterestRepository.findAll();
        assertThat(placeOfInterestList).hasSize(databaseSizeBeforeCreate + 1);
        PlaceOfInterest testPlaceOfInterest = placeOfInterestList.get(placeOfInterestList.size() - 1);
        assertThat(testPlaceOfInterest.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlaceOfInterest.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void createPlaceOfInterestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = placeOfInterestRepository.findAll().size();

        // Create the PlaceOfInterest with an existing ID
        placeOfInterest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaceOfInterestMockMvc.perform(post("/api/place-of-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfInterest)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceOfInterest in the database
        List<PlaceOfInterest> placeOfInterestList = placeOfInterestRepository.findAll();
        assertThat(placeOfInterestList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPlaceOfInterests() throws Exception {
        // Initialize the database
        placeOfInterestRepository.saveAndFlush(placeOfInterest);

        // Get all the placeOfInterestList
        restPlaceOfInterestMockMvc.perform(get("/api/place-of-interests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(placeOfInterest.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getPlaceOfInterest() throws Exception {
        // Initialize the database
        placeOfInterestRepository.saveAndFlush(placeOfInterest);

        // Get the placeOfInterest
        restPlaceOfInterestMockMvc.perform(get("/api/place-of-interests/{id}", placeOfInterest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(placeOfInterest.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPlaceOfInterest() throws Exception {
        // Get the placeOfInterest
        restPlaceOfInterestMockMvc.perform(get("/api/place-of-interests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlaceOfInterest() throws Exception {
        // Initialize the database
        placeOfInterestRepository.saveAndFlush(placeOfInterest);

        int databaseSizeBeforeUpdate = placeOfInterestRepository.findAll().size();

        // Update the placeOfInterest
        PlaceOfInterest updatedPlaceOfInterest = placeOfInterestRepository.findById(placeOfInterest.getId()).get();
        // Disconnect from session so that the updates on updatedPlaceOfInterest are not directly saved in db
        em.detach(updatedPlaceOfInterest);
        updatedPlaceOfInterest
            .name(UPDATED_NAME)
            .inCirculation(UPDATED_IN_CIRCULATION);

        restPlaceOfInterestMockMvc.perform(put("/api/place-of-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlaceOfInterest)))
            .andExpect(status().isOk());

        // Validate the PlaceOfInterest in the database
        List<PlaceOfInterest> placeOfInterestList = placeOfInterestRepository.findAll();
        assertThat(placeOfInterestList).hasSize(databaseSizeBeforeUpdate);
        PlaceOfInterest testPlaceOfInterest = placeOfInterestList.get(placeOfInterestList.size() - 1);
        assertThat(testPlaceOfInterest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlaceOfInterest.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
    }

    @Test
    @Transactional
    public void updateNonExistingPlaceOfInterest() throws Exception {
        int databaseSizeBeforeUpdate = placeOfInterestRepository.findAll().size();

        // Create the PlaceOfInterest

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaceOfInterestMockMvc.perform(put("/api/place-of-interests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(placeOfInterest)))
            .andExpect(status().isBadRequest());

        // Validate the PlaceOfInterest in the database
        List<PlaceOfInterest> placeOfInterestList = placeOfInterestRepository.findAll();
        assertThat(placeOfInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePlaceOfInterest() throws Exception {
        // Initialize the database
        placeOfInterestRepository.saveAndFlush(placeOfInterest);

        int databaseSizeBeforeDelete = placeOfInterestRepository.findAll().size();

        // Delete the placeOfInterest
        restPlaceOfInterestMockMvc.perform(delete("/api/place-of-interests/{id}", placeOfInterest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PlaceOfInterest> placeOfInterestList = placeOfInterestRepository.findAll();
        assertThat(placeOfInterestList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaceOfInterest.class);
        PlaceOfInterest placeOfInterest1 = new PlaceOfInterest();
        placeOfInterest1.setId(1L);
        PlaceOfInterest placeOfInterest2 = new PlaceOfInterest();
        placeOfInterest2.setId(placeOfInterest1.getId());
        assertThat(placeOfInterest1).isEqualTo(placeOfInterest2);
        placeOfInterest2.setId(2L);
        assertThat(placeOfInterest1).isNotEqualTo(placeOfInterest2);
        placeOfInterest1.setId(null);
        assertThat(placeOfInterest1).isNotEqualTo(placeOfInterest2);
    }
}
