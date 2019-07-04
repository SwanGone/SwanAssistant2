package com.swansoft.repository;

import com.swansoft.domain.Character;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Character entity.
 */
@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {

    @Query("select character from Character character where character.createdBy.login = ?#{principal.username}")
    List<Character> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct character from Character character left join fetch character.viewableBies",
        countQuery = "select count(distinct character) from Character character")
    Page<Character> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct character from Character character left join fetch character.viewableBies")
    List<Character> findAllWithEagerRelationships();

    @Query("select character from Character character left join fetch character.viewableBies where character.id =:id")
    Optional<Character> findOneWithEagerRelationships(@Param("id") Long id);

}
