package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A PCCommentThread.
 */
@Entity
@Table(name = "pc_comment_thread")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PCCommentThread implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "headline")
    private String headline;

    @Column(name = "date_added")
    private Instant dateAdded;

    @ManyToOne
    @JsonIgnoreProperties("pCCommentThreads")
    private Remarks existsIn;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeadline() {
        return headline;
    }

    public PCCommentThread headline(String headline) {
        this.headline = headline;
        return this;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public Instant getDateAdded() {
        return dateAdded;
    }

    public PCCommentThread dateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Remarks getExistsIn() {
        return existsIn;
    }

    public PCCommentThread existsIn(Remarks remarks) {
        this.existsIn = remarks;
        return this;
    }

    public void setExistsIn(Remarks remarks) {
        this.existsIn = remarks;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PCCommentThread)) {
            return false;
        }
        return id != null && id.equals(((PCCommentThread) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PCCommentThread{" +
            "id=" + getId() +
            ", headline='" + getHeadline() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            "}";
    }
}
