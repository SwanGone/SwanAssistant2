package com.swansoft.repository;

import com.swansoft.domain.PlaceOfInterest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PlaceOfInterest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlaceOfInterestRepository extends JpaRepository<PlaceOfInterest, Long> {

}
