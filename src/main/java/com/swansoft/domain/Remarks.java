package com.swansoft.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Remarks.
 */
@Entity
@Table(name = "remarks")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Remarks implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "title")
    private String title;

    @OneToOne
    @JoinColumn(unique = true)
    private GMComment gmComment;

    @OneToOne
    @JoinColumn(unique = true)
    private GeneralInfo generalInfo;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Remarks title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public GMComment getGmComment() {
        return gmComment;
    }

    public Remarks gmComment(GMComment gMComment) {
        this.gmComment = gMComment;
        return this;
    }

    public void setGmComment(GMComment gMComment) {
        this.gmComment = gMComment;
    }

    public GeneralInfo getGeneralInfo() {
        return generalInfo;
    }

    public Remarks generalInfo(GeneralInfo generalInfo) {
        this.generalInfo = generalInfo;
        return this;
    }

    public void setGeneralInfo(GeneralInfo generalInfo) {
        this.generalInfo = generalInfo;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Remarks)) {
            return false;
        }
        return id != null && id.equals(((Remarks) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Remarks{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
