package com.swansoft.repository;

import com.swansoft.domain.GMComment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the GMComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GMCommentRepository extends JpaRepository<GMComment, Long> {

}
