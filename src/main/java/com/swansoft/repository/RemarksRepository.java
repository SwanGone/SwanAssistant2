package com.swansoft.repository;

import com.swansoft.domain.Remarks;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Remarks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RemarksRepository extends JpaRepository<Remarks, Long> {

}
