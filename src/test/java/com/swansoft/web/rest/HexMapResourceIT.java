package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.HexMap;
import com.swansoft.repository.HexMapRepository;
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
 * Integration tests for the {@Link HexMapResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class HexMapResourceIT {

    private static final String DEFAULT_SEED = "AAAAAAAAAA";
    private static final String UPDATED_SEED = "BBBBBBBBBB";

    @Autowired
    private HexMapRepository hexMapRepository;

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

    private MockMvc restHexMapMockMvc;

    private HexMap hexMap;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HexMapResource hexMapResource = new HexMapResource(hexMapRepository);
        this.restHexMapMockMvc = MockMvcBuilders.standaloneSetup(hexMapResource)
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
    public static HexMap createEntity(EntityManager em) {
        HexMap hexMap = new HexMap()
            .seed(DEFAULT_SEED);
        return hexMap;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HexMap createUpdatedEntity(EntityManager em) {
        HexMap hexMap = new HexMap()
            .seed(UPDATED_SEED);
        return hexMap;
    }

    @BeforeEach
    public void initTest() {
        hexMap = createEntity(em);
    }

    @Test
    @Transactional
    public void createHexMap() throws Exception {
        int databaseSizeBeforeCreate = hexMapRepository.findAll().size();

        // Create the HexMap
        restHexMapMockMvc.perform(post("/api/hex-maps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexMap)))
            .andExpect(status().isCreated());

        // Validate the HexMap in the database
        List<HexMap> hexMapList = hexMapRepository.findAll();
        assertThat(hexMapList).hasSize(databaseSizeBeforeCreate + 1);
        HexMap testHexMap = hexMapList.get(hexMapList.size() - 1);
        assertThat(testHexMap.getSeed()).isEqualTo(DEFAULT_SEED);
    }

    @Test
    @Transactional
    public void createHexMapWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = hexMapRepository.findAll().size();

        // Create the HexMap with an existing ID
        hexMap.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHexMapMockMvc.perform(post("/api/hex-maps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexMap)))
            .andExpect(status().isBadRequest());

        // Validate the HexMap in the database
        List<HexMap> hexMapList = hexMapRepository.findAll();
        assertThat(hexMapList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllHexMaps() throws Exception {
        // Initialize the database
        hexMapRepository.saveAndFlush(hexMap);

        // Get all the hexMapList
        restHexMapMockMvc.perform(get("/api/hex-maps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hexMap.getId().intValue())))
            .andExpect(jsonPath("$.[*].seed").value(hasItem(DEFAULT_SEED.toString())));
    }
    
    @Test
    @Transactional
    public void getHexMap() throws Exception {
        // Initialize the database
        hexMapRepository.saveAndFlush(hexMap);

        // Get the hexMap
        restHexMapMockMvc.perform(get("/api/hex-maps/{id}", hexMap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(hexMap.getId().intValue()))
            .andExpect(jsonPath("$.seed").value(DEFAULT_SEED.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingHexMap() throws Exception {
        // Get the hexMap
        restHexMapMockMvc.perform(get("/api/hex-maps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHexMap() throws Exception {
        // Initialize the database
        hexMapRepository.saveAndFlush(hexMap);

        int databaseSizeBeforeUpdate = hexMapRepository.findAll().size();

        // Update the hexMap
        HexMap updatedHexMap = hexMapRepository.findById(hexMap.getId()).get();
        // Disconnect from session so that the updates on updatedHexMap are not directly saved in db
        em.detach(updatedHexMap);
        updatedHexMap
            .seed(UPDATED_SEED);

        restHexMapMockMvc.perform(put("/api/hex-maps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHexMap)))
            .andExpect(status().isOk());

        // Validate the HexMap in the database
        List<HexMap> hexMapList = hexMapRepository.findAll();
        assertThat(hexMapList).hasSize(databaseSizeBeforeUpdate);
        HexMap testHexMap = hexMapList.get(hexMapList.size() - 1);
        assertThat(testHexMap.getSeed()).isEqualTo(UPDATED_SEED);
    }

    @Test
    @Transactional
    public void updateNonExistingHexMap() throws Exception {
        int databaseSizeBeforeUpdate = hexMapRepository.findAll().size();

        // Create the HexMap

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHexMapMockMvc.perform(put("/api/hex-maps")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexMap)))
            .andExpect(status().isBadRequest());

        // Validate the HexMap in the database
        List<HexMap> hexMapList = hexMapRepository.findAll();
        assertThat(hexMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteHexMap() throws Exception {
        // Initialize the database
        hexMapRepository.saveAndFlush(hexMap);

        int databaseSizeBeforeDelete = hexMapRepository.findAll().size();

        // Delete the hexMap
        restHexMapMockMvc.perform(delete("/api/hex-maps/{id}", hexMap.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HexMap> hexMapList = hexMapRepository.findAll();
        assertThat(hexMapList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HexMap.class);
        HexMap hexMap1 = new HexMap();
        hexMap1.setId(1L);
        HexMap hexMap2 = new HexMap();
        hexMap2.setId(hexMap1.getId());
        assertThat(hexMap1).isEqualTo(hexMap2);
        hexMap2.setId(2L);
        assertThat(hexMap1).isNotEqualTo(hexMap2);
        hexMap1.setId(null);
        assertThat(hexMap1).isNotEqualTo(hexMap2);
    }
}
