package com.swansoft.repository;

import com.swansoft.domain.Occupation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Occupation entity.
 */
@Repository
public interface OccupationRepository extends JpaRepository<Occupation, Long> {

    @Query("select occupation from Occupation occupation where occupation.createdBy.login = ?#{principal.username}")
    List<Occupation> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct occupation from Occupation occupation left join fetch occupation.viewableBies",
        countQuery = "select count(distinct occupation) from Occupation occupation")
    Page<Occupation> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct occupation from Occupation occupation left join fetch occupation.viewableBies")
    List<Occupation> findAllWithEagerRelationships();

    @Query("select occupation from Occupation occupation left join fetch occupation.viewableBies where occupation.id =:id")
    Optional<Occupation> findOneWithEagerRelationships(@Param("id") Long id);

}
