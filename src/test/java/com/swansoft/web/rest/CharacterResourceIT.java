package com.swansoft.web.rest;

import com.swansoft.Swanassistant2App;
import com.swansoft.domain.Character;
import com.swansoft.repository.CharacterRepository;
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
import java.util.ArrayList;
import java.util.List;

import static com.swansoft.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link CharacterResource} REST controller.
 */
@SpringBootTest(classes = Swanassistant2App.class)
public class CharacterResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IN_CIRCULATION = false;
    private static final Boolean UPDATED_IN_CIRCULATION = true;

    private static final Boolean DEFAULT_IS_MOST_CURRENT = false;
    private static final Boolean UPDATED_IS_MOST_CURRENT = true;

    private static final Boolean DEFAULT_IS_PLAYER_CHARACTER = false;
    private static final Boolean UPDATED_IS_PLAYER_CHARACTER = true;

    private static final Boolean DEFAULT_IS_DIPLOMAT = false;
    private static final Boolean UPDATED_IS_DIPLOMAT = true;

    @Autowired
    private CharacterRepository characterRepository;

    @Mock
    private CharacterRepository characterRepositoryMock;

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

    private MockMvc restCharacterMockMvc;

    private Character character;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CharacterResource characterResource = new CharacterResource(characterRepository);
        this.restCharacterMockMvc = MockMvcBuilders.standaloneSetup(characterResource)
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
    public static Character createEntity(EntityManager em) {
        Character character = new Character()
            .name(DEFAULT_NAME)
            .inCirculation(DEFAULT_IN_CIRCULATION)
            .isMostCurrent(DEFAULT_IS_MOST_CURRENT)
            .isPlayerCharacter(DEFAULT_IS_PLAYER_CHARACTER)
            .isDiplomat(DEFAULT_IS_DIPLOMAT);
        return character;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Character createUpdatedEntity(EntityManager em) {
        Character character = new Character()
            .name(UPDATED_NAME)
            .inCirculation(UPDATED_IN_CIRCULATION)
            .isMostCurrent(UPDATED_IS_MOST_CURRENT)
            .isPlayerCharacter(UPDATED_IS_PLAYER_CHARACTER)
            .isDiplomat(UPDATED_IS_DIPLOMAT);
        return character;
    }

    @BeforeEach
    public void initTest() {
        character = createEntity(em);
    }

    @Test
    @Transactional
    public void createCharacter() throws Exception {
        int databaseSizeBeforeCreate = characterRepository.findAll().size();

        // Create the Character
        restCharacterMockMvc.perform(post("/api/characters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(character)))
            .andExpect(status().isCreated());

        // Validate the Character in the database
        List<Character> characterList = characterRepository.findAll();
        assertThat(characterList).hasSize(databaseSizeBeforeCreate + 1);
        Character testCharacter = characterList.get(characterList.size() - 1);
        assertThat(testCharacter.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCharacter.isInCirculation()).isEqualTo(DEFAULT_IN_CIRCULATION);
        assertThat(testCharacter.isIsMostCurrent()).isEqualTo(DEFAULT_IS_MOST_CURRENT);
        assertThat(testCharacter.isIsPlayerCharacter()).isEqualTo(DEFAULT_IS_PLAYER_CHARACTER);
        assertThat(testCharacter.isIsDiplomat()).isEqualTo(DEFAULT_IS_DIPLOMAT);
    }

    @Test
    @Transactional
    public void createCharacterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = characterRepository.findAll().size();

        // Create the Character with an existing ID
        character.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharacterMockMvc.perform(post("/api/characters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(character)))
            .andExpect(status().isBadRequest());

        // Validate the Character in the database
        List<Character> characterList = characterRepository.findAll();
        assertThat(characterList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCharacters() throws Exception {
        // Initialize the database
        characterRepository.saveAndFlush(character);

        // Get all the characterList
        restCharacterMockMvc.perform(get("/api/characters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(character.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].inCirculation").value(hasItem(DEFAULT_IN_CIRCULATION.booleanValue())))
            .andExpect(jsonPath("$.[*].isMostCurrent").value(hasItem(DEFAULT_IS_MOST_CURRENT.booleanValue())))
            .andExpect(jsonPath("$.[*].isPlayerCharacter").value(hasItem(DEFAULT_IS_PLAYER_CHARACTER.booleanValue())))
            .andExpect(jsonPath("$.[*].isDiplomat").value(hasItem(DEFAULT_IS_DIPLOMAT.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllCharactersWithEagerRelationshipsIsEnabled() throws Exception {
        CharacterResource characterResource = new CharacterResource(characterRepositoryMock);
        when(characterRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restCharacterMockMvc = MockMvcBuilders.standaloneSetup(characterResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCharacterMockMvc.perform(get("/api/characters?eagerload=true"))
        .andExpect(status().isOk());

        verify(characterRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllCharactersWithEagerRelationshipsIsNotEnabled() throws Exception {
        CharacterResource characterResource = new CharacterResource(characterRepositoryMock);
            when(characterRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restCharacterMockMvc = MockMvcBuilders.standaloneSetup(characterResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restCharacterMockMvc.perform(get("/api/characters?eagerload=true"))
        .andExpect(status().isOk());

            verify(characterRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getCharacter() throws Exception {
        // Initialize the database
        characterRepository.saveAndFlush(character);

        // Get the character
        restCharacterMockMvc.perform(get("/api/characters/{id}", character.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(character.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.inCirculation").value(DEFAULT_IN_CIRCULATION.booleanValue()))
            .andExpect(jsonPath("$.isMostCurrent").value(DEFAULT_IS_MOST_CURRENT.booleanValue()))
            .andExpect(jsonPath("$.isPlayerCharacter").value(DEFAULT_IS_PLAYER_CHARACTER.booleanValue()))
            .andExpect(jsonPath("$.isDiplomat").value(DEFAULT_IS_DIPLOMAT.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCharacter() throws Exception {
        // Get the character
        restCharacterMockMvc.perform(get("/api/characters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCharacter() throws Exception {
        // Initialize the database
        characterRepository.saveAndFlush(character);

        int databaseSizeBeforeUpdate = characterRepository.findAll().size();

        // Update the character
        Character updatedCharacter = characterRepository.findById(character.getId()).get();
        // Disconnect from session so that the updates on updatedCharacter are not directly saved in db
        em.detach(updatedCharacter);
        updatedCharacter
            .name(UPDATED_NAME)
            .inCirculation(UPDATED_IN_CIRCULATION)
            .isMostCurrent(UPDATED_IS_MOST_CURRENT)
            .isPlayerCharacter(UPDATED_IS_PLAYER_CHARACTER)
            .isDiplomat(UPDATED_IS_DIPLOMAT);

        restCharacterMockMvc.perform(put("/api/characters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCharacter)))
            .andExpect(status().isOk());

        // Validate the Character in the database
        List<Character> characterList = characterRepository.findAll();
        assertThat(characterList).hasSize(databaseSizeBeforeUpdate);
        Character testCharacter = characterList.get(characterList.size() - 1);
        assertThat(testCharacter.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCharacter.isInCirculation()).isEqualTo(UPDATED_IN_CIRCULATION);
        assertThat(testCharacter.isIsMostCurrent()).isEqualTo(UPDATED_IS_MOST_CURRENT);
        assertThat(testCharacter.isIsPlayerCharacter()).isEqualTo(UPDATED_IS_PLAYER_CHARACTER);
        assertThat(testCharacter.isIsDiplomat()).isEqualTo(UPDATED_IS_DIPLOMAT);
    }

    @Test
    @Transactional
    public void updateNonExistingCharacter() throws Exception {
        int databaseSizeBeforeUpdate = characterRepository.findAll().size();

        // Create the Character

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharacterMockMvc.perform(put("/api/characters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(character)))
            .andExpect(status().isBadRequest());

        // Validate the Character in the database
        List<Character> characterList = characterRepository.findAll();
        assertThat(characterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCharacter() throws Exception {
        // Initialize the database
        characterRepository.saveAndFlush(character);

        int databaseSizeBeforeDelete = characterRepository.findAll().size();

        // Delete the character
        restCharacterMockMvc.perform(delete("/api/characters/{id}", character.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Character> characterList = characterRepository.findAll();
        assertThat(characterList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Character.class);
        Character character1 = new Character();
        character1.setId(1L);
        Character character2 = new Character();
        character2.setId(character1.getId());
        assertThat(character1).isEqualTo(character2);
        character2.setId(2L);
        assertThat(character1).isNotEqualTo(character2);
        character1.setId(null);
        assertThat(character1).isNotEqualTo(character2);
    }
}
