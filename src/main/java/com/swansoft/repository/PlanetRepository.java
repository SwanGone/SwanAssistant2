package com.swansoft.repository;

import com.swansoft.domain.Planet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Planet entity.
 */
@Repository
public interface PlanetRepository extends JpaRepository<Planet, Long> {

    @Query("select planet from Planet planet where planet.createdBy.login = ?#{principal.username}")
    List<Planet> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct planet from Planet planet left join fetch planet.viewableBies",
        countQuery = "select count(distinct planet) from Planet planet")
    Page<Planet> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct planet from Planet planet left join fetch planet.viewableBies")
    List<Planet> findAllWithEagerRelationships();

    @Query("select planet from Planet planet left join fetch planet.viewableBies where planet.id =:id")
    Optional<Planet> findOneWithEagerRelationships(@Param("id") Long id);

}
