package com.swansoft.repository;

import com.swansoft.domain.PCCommentThread;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the PCCommentThread entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PCCommentThreadRepository extends JpaRepository<PCCommentThread, Long> {

}
