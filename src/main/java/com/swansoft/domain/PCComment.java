package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A PCComment.
 */
@Entity
@Table(name = "pc_comment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PCComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "date_added")
    private Instant dateAdded;

    @ManyToOne
    @JsonIgnoreProperties("pCComments")
    private PCCommentThread existsIn;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public PCComment content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getDateAdded() {
        return dateAdded;
    }

    public PCComment dateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public PCCommentThread getExistsIn() {
        return existsIn;
    }

    public PCComment existsIn(PCCommentThread pCCommentThread) {
        this.existsIn = pCCommentThread;
        return this;
    }

    public void setExistsIn(PCCommentThread pCCommentThread) {
        this.existsIn = pCCommentThread;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PCComment)) {
            return false;
        }
        return id != null && id.equals(((PCComment) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PCComment{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            "}";
    }
}
