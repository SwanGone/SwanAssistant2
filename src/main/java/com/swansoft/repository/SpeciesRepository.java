package com.swansoft.repository;

import com.swansoft.domain.Species;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Species entity.
 */
@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {

    @Query("select species from Species species where species.createdBy.login = ?#{principal.username}")
    List<Species> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct species from Species species left join fetch species.viewableBies",
        countQuery = "select count(distinct species) from Species species")
    Page<Species> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct species from Species species left join fetch species.viewableBies")
    List<Species> findAllWithEagerRelationships();

    @Query("select species from Species species left join fetch species.viewableBies where species.id =:id")
    Optional<Species> findOneWithEagerRelationships(@Param("id") Long id);

}
