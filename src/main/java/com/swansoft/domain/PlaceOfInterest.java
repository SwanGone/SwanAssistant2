package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A PlaceOfInterest.
 */
@Entity
@Table(name = "place_of_interest")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class PlaceOfInterest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "in_circulation")
    private Boolean inCirculation;

    @OneToOne
    @JoinColumn(unique = true)
    private Remarks remarks;

    @ManyToOne
    @JsonIgnoreProperties("placeOfInterests")
    private Planet locatedOn;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public PlaceOfInterest name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isInCirculation() {
        return inCirculation;
    }

    public PlaceOfInterest inCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
        return this;
    }

    public void setInCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
    }

    public Remarks getRemarks() {
        return remarks;
    }

    public PlaceOfInterest remarks(Remarks remarks) {
        this.remarks = remarks;
        return this;
    }

    public void setRemarks(Remarks remarks) {
        this.remarks = remarks;
    }

    public Planet getLocatedOn() {
        return locatedOn;
    }

    public PlaceOfInterest locatedOn(Planet planet) {
        this.locatedOn = planet;
        return this;
    }

    public void setLocatedOn(Planet planet) {
        this.locatedOn = planet;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlaceOfInterest)) {
            return false;
        }
        return id != null && id.equals(((PlaceOfInterest) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PlaceOfInterest{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", inCirculation='" + isInCirculation() + "'" +
            "}";
    }
}
