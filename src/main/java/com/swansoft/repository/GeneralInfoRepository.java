package com.swansoft.repository;

import com.swansoft.domain.GeneralInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the GeneralInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GeneralInfoRepository extends JpaRepository<GeneralInfo, Long> {

}
