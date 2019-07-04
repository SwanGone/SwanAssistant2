package com.swansoft.repository;

import com.swansoft.domain.HexSector;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the HexSector entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HexSectorRepository extends JpaRepository<HexSector, Long> {

}
