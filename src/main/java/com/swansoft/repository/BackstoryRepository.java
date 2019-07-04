package com.swansoft.repository;

import com.swansoft.domain.Backstory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Backstory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BackstoryRepository extends JpaRepository<Backstory, Long> {

}
