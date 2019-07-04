package com.swansoft.repository;

import com.swansoft.domain.OriginDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the OriginDetails entity.
 */
@Repository
public interface OriginDetailsRepository extends JpaRepository<OriginDetails, Long> {

    @Query("select originDetails from OriginDetails originDetails where originDetails.createdBy.login = ?#{principal.username}")
    List<OriginDetails> findByCreatedByIsCurrentUser();

    @Query(value = "select distinct originDetails from OriginDetails originDetails left join fetch originDetails.viewableBies",
        countQuery = "select count(distinct originDetails) from OriginDetails originDetails")
    Page<OriginDetails> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct originDetails from OriginDetails originDetails left join fetch originDetails.viewableBies")
    List<OriginDetails> findAllWithEagerRelationships();

    @Query("select originDetails from OriginDetails originDetails left join fetch originDetails.viewableBies where originDetails.id =:id")
    Optional<OriginDetails> findOneWithEagerRelationships(@Param("id") Long id);

}
