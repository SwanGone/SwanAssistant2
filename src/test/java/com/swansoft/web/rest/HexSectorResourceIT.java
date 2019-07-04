package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.HexSector;
import com.swansoft.repository.HexSectorRepository;
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
 * Integration tests for the {@Link HexSectorResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class HexSectorResourceIT {

    private static final String DEFAULT_HEX_ROW = "AAAAAAAAAA";
    private static final String UPDATED_HEX_ROW = "BBBBBBBBBB";

    private static final String DEFAULT_HEX_COLUMN = "AAAAAAAAAA";
    private static final String UPDATED_HEX_COLUMN = "BBBBBBBBBB";

    private static final String DEFAULT_COORDINATES = "AAAAAAAAAA";
    private static final String UPDATED_COORDINATES = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_MAPPED = false;
    private static final Boolean UPDATED_IS_MAPPED = true;

    @Autowired
    private HexSectorRepository hexSectorRepository;

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

    private MockMvc restHexSectorMockMvc;

    private HexSector hexSector;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HexSectorResource hexSectorResource = new HexSectorResource(hexSectorRepository);
        this.restHexSectorMockMvc = MockMvcBuilders.standaloneSetup(hexSectorResource)
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
    public static HexSector createEntity(EntityManager em) {
        HexSector hexSector = new HexSector()
            .hexRow(DEFAULT_HEX_ROW)
            .hexColumn(DEFAULT_HEX_COLUMN)
            .coordinates(DEFAULT_COORDINATES)
            .isMapped(DEFAULT_IS_MAPPED);
        return hexSector;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HexSector createUpdatedEntity(EntityManager em) {
        HexSector hexSector = new HexSector()
            .hexRow(UPDATED_HEX_ROW)
            .hexColumn(UPDATED_HEX_COLUMN)
            .coordinates(UPDATED_COORDINATES)
            .isMapped(UPDATED_IS_MAPPED);
        return hexSector;
    }

    @BeforeEach
    public void initTest() {
        hexSector = createEntity(em);
    }

    @Test
    @Transactional
    public void createHexSector() throws Exception {
        int databaseSizeBeforeCreate = hexSectorRepository.findAll().size();

        // Create the HexSector
        restHexSectorMockMvc.perform(post("/api/hex-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexSector)))
            .andExpect(status().isCreated());

        // Validate the HexSector in the database
        List<HexSector> hexSectorList = hexSectorRepository.findAll();
        assertThat(hexSectorList).hasSize(databaseSizeBeforeCreate + 1);
        HexSector testHexSector = hexSectorList.get(hexSectorList.size() - 1);
        assertThat(testHexSector.getHexRow()).isEqualTo(DEFAULT_HEX_ROW);
        assertThat(testHexSector.getHexColumn()).isEqualTo(DEFAULT_HEX_COLUMN);
        assertThat(testHexSector.getCoordinates()).isEqualTo(DEFAULT_COORDINATES);
        assertThat(testHexSector.isIsMapped()).isEqualTo(DEFAULT_IS_MAPPED);
    }

    @Test
    @Transactional
    public void createHexSectorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = hexSectorRepository.findAll().size();

        // Create the HexSector with an existing ID
        hexSector.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHexSectorMockMvc.perform(post("/api/hex-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexSector)))
            .andExpect(status().isBadRequest());

        // Validate the HexSector in the database
        List<HexSector> hexSectorList = hexSectorRepository.findAll();
        assertThat(hexSectorList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllHexSectors() throws Exception {
        // Initialize the database
        hexSectorRepository.saveAndFlush(hexSector);

        // Get all the hexSectorList
        restHexSectorMockMvc.perform(get("/api/hex-sectors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hexSector.getId().intValue())))
            .andExpect(jsonPath("$.[*].hexRow").value(hasItem(DEFAULT_HEX_ROW.toString())))
            .andExpect(jsonPath("$.[*].hexColumn").value(hasItem(DEFAULT_HEX_COLUMN.toString())))
            .andExpect(jsonPath("$.[*].coordinates").value(hasItem(DEFAULT_COORDINATES.toString())))
            .andExpect(jsonPath("$.[*].isMapped").value(hasItem(DEFAULT_IS_MAPPED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getHexSector() throws Exception {
        // Initialize the database
        hexSectorRepository.saveAndFlush(hexSector);

        // Get the hexSector
        restHexSectorMockMvc.perform(get("/api/hex-sectors/{id}", hexSector.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(hexSector.getId().intValue()))
            .andExpect(jsonPath("$.hexRow").value(DEFAULT_HEX_ROW.toString()))
            .andExpect(jsonPath("$.hexColumn").value(DEFAULT_HEX_COLUMN.toString()))
            .andExpect(jsonPath("$.coordinates").value(DEFAULT_COORDINATES.toString()))
            .andExpect(jsonPath("$.isMapped").value(DEFAULT_IS_MAPPED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingHexSector() throws Exception {
        // Get the hexSector
        restHexSectorMockMvc.perform(get("/api/hex-sectors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHexSector() throws Exception {
        // Initialize the database
        hexSectorRepository.saveAndFlush(hexSector);

        int databaseSizeBeforeUpdate = hexSectorRepository.findAll().size();

        // Update the hexSector
        HexSector updatedHexSector = hexSectorRepository.findById(hexSector.getId()).get();
        // Disconnect from session so that the updates on updatedHexSector are not directly saved in db
        em.detach(updatedHexSector);
        updatedHexSector
            .hexRow(UPDATED_HEX_ROW)
            .hexColumn(UPDATED_HEX_COLUMN)
            .coordinates(UPDATED_COORDINATES)
            .isMapped(UPDATED_IS_MAPPED);

        restHexSectorMockMvc.perform(put("/api/hex-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHexSector)))
            .andExpect(status().isOk());

        // Validate the HexSector in the database
        List<HexSector> hexSectorList = hexSectorRepository.findAll();
        assertThat(hexSectorList).hasSize(databaseSizeBeforeUpdate);
        HexSector testHexSector = hexSectorList.get(hexSectorList.size() - 1);
        assertThat(testHexSector.getHexRow()).isEqualTo(UPDATED_HEX_ROW);
        assertThat(testHexSector.getHexColumn()).isEqualTo(UPDATED_HEX_COLUMN);
        assertThat(testHexSector.getCoordinates()).isEqualTo(UPDATED_COORDINATES);
        assertThat(testHexSector.isIsMapped()).isEqualTo(UPDATED_IS_MAPPED);
    }

    @Test
    @Transactional
    public void updateNonExistingHexSector() throws Exception {
        int databaseSizeBeforeUpdate = hexSectorRepository.findAll().size();

        // Create the HexSector

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHexSectorMockMvc.perform(put("/api/hex-sectors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(hexSector)))
            .andExpect(status().isBadRequest());

        // Validate the HexSector in the database
        List<HexSector> hexSectorList = hexSectorRepository.findAll();
        assertThat(hexSectorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteHexSector() throws Exception {
        // Initialize the database
        hexSectorRepository.saveAndFlush(hexSector);

        int databaseSizeBeforeDelete = hexSectorRepository.findAll().size();

        // Delete the hexSector
        restHexSectorMockMvc.perform(delete("/api/hex-sectors/{id}", hexSector.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HexSector> hexSectorList = hexSectorRepository.findAll();
        assertThat(hexSectorList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HexSector.class);
        HexSector hexSector1 = new HexSector();
        hexSector1.setId(1L);
        HexSector hexSector2 = new HexSector();
        hexSector2.setId(hexSector1.getId());
        assertThat(hexSector1).isEqualTo(hexSector2);
        hexSector2.setId(2L);
        assertThat(hexSector1).isNotEqualTo(hexSector2);
        hexSector1.setId(null);
        assertThat(hexSector1).isNotEqualTo(hexSector2);
    }
}
