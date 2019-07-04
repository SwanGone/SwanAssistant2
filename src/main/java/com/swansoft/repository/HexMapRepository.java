package com.swansoft.repository;

import com.swansoft.domain.HexMap;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the HexMap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HexMapRepository extends JpaRepository<HexMap, Long> {

}
