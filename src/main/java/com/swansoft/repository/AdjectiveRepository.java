package com.swansoft.repository;

import com.swansoft.domain.Adjective;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Adjective entity.
 */
@Repository
public interface AdjectiveRepository extends JpaRepository<Adjective, Long> {

    @Query("select adjective from Adjective adjective where adjective.createdBy.login = ?#{principal.username}")
    List<Adjective> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct adjective from Adjective adjective left join fetch adjective.viewableBies",
        countQuery = "select count(distinct adjective) from Adjective adjective")
    Page<Adjective> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct adjective from Adjective adjective left join fetch adjective.viewableBies")
    List<Adjective> findAllWithEagerRelationships();

    @Query("select adjective from Adjective adjective left join fetch adjective.viewableBies where adjective.id =:id")
    Optional<Adjective> findOneWithEagerRelationships(@Param("id") Long id);

}
