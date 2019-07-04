package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.PCCommentThread;
import com.swansoft.repository.PCCommentThreadRepository;
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
 * Integration tests for the {@Link PCCommentThreadResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class PCCommentThreadResourceIT {

    private static final String DEFAULT_HEADLINE = "AAAAAAAAAA";
    private static final String UPDATED_HEADLINE = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private PCCommentThreadRepository pCCommentThreadRepository;

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

    private MockMvc restPCCommentThreadMockMvc;

    private PCCommentThread pCCommentThread;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PCCommentThreadResource pCCommentThreadResource = new PCCommentThreadResource(pCCommentThreadRepository);
        this.restPCCommentThreadMockMvc = MockMvcBuilders.standaloneSetup(pCCommentThreadResource)
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
    public static PCCommentThread createEntity(EntityManager em) {
        PCCommentThread pCCommentThread = new PCCommentThread()
            .headline(DEFAULT_HEADLINE)
            .dateAdded(DEFAULT_DATE_ADDED);
        return pCCommentThread;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PCCommentThread createUpdatedEntity(EntityManager em) {
        PCCommentThread pCCommentThread = new PCCommentThread()
            .headline(UPDATED_HEADLINE)
            .dateAdded(UPDATED_DATE_ADDED);
        return pCCommentThread;
    }

    @BeforeEach
    public void initTest() {
        pCCommentThread = createEntity(em);
    }

    @Test
    @Transactional
    public void createPCCommentThread() throws Exception {
        int databaseSizeBeforeCreate = pCCommentThreadRepository.findAll().size();

        // Create the PCCommentThread
        restPCCommentThreadMockMvc.perform(post("/api/pc-comment-threads")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCCommentThread)))
            .andExpect(status().isCreated());

        // Validate the PCCommentThread in the database
        List<PCCommentThread> pCCommentThreadList = pCCommentThreadRepository.findAll();
        assertThat(pCCommentThreadList).hasSize(databaseSizeBeforeCreate + 1);
        PCCommentThread testPCCommentThread = pCCommentThreadList.get(pCCommentThreadList.size() - 1);
        assertThat(testPCCommentThread.getHeadline()).isEqualTo(DEFAULT_HEADLINE);
        assertThat(testPCCommentThread.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
    }

    @Test
    @Transactional
    public void createPCCommentThreadWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pCCommentThreadRepository.findAll().size();

        // Create the PCCommentThread with an existing ID
        pCCommentThread.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPCCommentThreadMockMvc.perform(post("/api/pc-comment-threads")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCCommentThread)))
            .andExpect(status().isBadRequest());

        // Validate the PCCommentThread in the database
        List<PCCommentThread> pCCommentThreadList = pCCommentThreadRepository.findAll();
        assertThat(pCCommentThreadList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPCCommentThreads() throws Exception {
        // Initialize the database
        pCCommentThreadRepository.saveAndFlush(pCCommentThread);

        // Get all the pCCommentThreadList
        restPCCommentThreadMockMvc.perform(get("/api/pc-comment-threads?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pCCommentThread.getId().intValue())))
            .andExpect(jsonPath("$.[*].headline").value(hasItem(DEFAULT_HEADLINE.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())));
    }
    
    @Test
    @Transactional
    public void getPCCommentThread() throws Exception {
        // Initialize the database
        pCCommentThreadRepository.saveAndFlush(pCCommentThread);

        // Get the pCCommentThread
        restPCCommentThreadMockMvc.perform(get("/api/pc-comment-threads/{id}", pCCommentThread.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pCCommentThread.getId().intValue()))
            .andExpect(jsonPath("$.headline").value(DEFAULT_HEADLINE.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPCCommentThread() throws Exception {
        // Get the pCCommentThread
        restPCCommentThreadMockMvc.perform(get("/api/pc-comment-threads/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePCCommentThread() throws Exception {
        // Initialize the database
        pCCommentThreadRepository.saveAndFlush(pCCommentThread);

        int databaseSizeBeforeUpdate = pCCommentThreadRepository.findAll().size();

        // Update the pCCommentThread
        PCCommentThread updatedPCCommentThread = pCCommentThreadRepository.findById(pCCommentThread.getId()).get();
        // Disconnect from session so that the updates on updatedPCCommentThread are not directly saved in db
        em.detach(updatedPCCommentThread);
        updatedPCCommentThread
            .headline(UPDATED_HEADLINE)
            .dateAdded(UPDATED_DATE_ADDED);

        restPCCommentThreadMockMvc.perform(put("/api/pc-comment-threads")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPCCommentThread)))
            .andExpect(status().isOk());

        // Validate the PCCommentThread in the database
        List<PCCommentThread> pCCommentThreadList = pCCommentThreadRepository.findAll();
        assertThat(pCCommentThreadList).hasSize(databaseSizeBeforeUpdate);
        PCCommentThread testPCCommentThread = pCCommentThreadList.get(pCCommentThreadList.size() - 1);
        assertThat(testPCCommentThread.getHeadline()).isEqualTo(UPDATED_HEADLINE);
        assertThat(testPCCommentThread.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
    }

    @Test
    @Transactional
    public void updateNonExistingPCCommentThread() throws Exception {
        int databaseSizeBeforeUpdate = pCCommentThreadRepository.findAll().size();

        // Create the PCCommentThread

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPCCommentThreadMockMvc.perform(put("/api/pc-comment-threads")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pCCommentThread)))
            .andExpect(status().isBadRequest());

        // Validate the PCCommentThread in the database
        List<PCCommentThread> pCCommentThreadList = pCCommentThreadRepository.findAll();
        assertThat(pCCommentThreadList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePCCommentThread() throws Exception {
        // Initialize the database
        pCCommentThreadRepository.saveAndFlush(pCCommentThread);

        int databaseSizeBeforeDelete = pCCommentThreadRepository.findAll().size();

        // Delete the pCCommentThread
        restPCCommentThreadMockMvc.perform(delete("/api/pc-comment-threads/{id}", pCCommentThread.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PCCommentThread> pCCommentThreadList = pCCommentThreadRepository.findAll();
        assertThat(pCCommentThreadList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PCCommentThread.class);
        PCCommentThread pCCommentThread1 = new PCCommentThread();
        pCCommentThread1.setId(1L);
        PCCommentThread pCCommentThread2 = new PCCommentThread();
        pCCommentThread2.setId(pCCommentThread1.getId());
        assertThat(pCCommentThread1).isEqualTo(pCCommentThread2);
        pCCommentThread2.setId(2L);
        assertThat(pCCommentThread1).isNotEqualTo(pCCommentThread2);
        pCCommentThread1.setId(null);
        assertThat(pCCommentThread1).isNotEqualTo(pCCommentThread2);
    }
}
