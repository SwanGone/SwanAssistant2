package com.swansoft.repository;

import com.swansoft.domain.PCComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PCComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PCCommentRepository extends JpaRepository<PCComment, Long> {

}
