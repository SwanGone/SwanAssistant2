package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Backstory.
 */
@Entity
@Table(name = "backstory")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Backstory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "text")
    private String text;

    @ManyToOne
    @JsonIgnoreProperties("backstories")
    private Adjective adjective;

    @ManyToOne
    @JsonIgnoreProperties("backstories")
    private Species species;

    @ManyToOne
    @JsonIgnoreProperties("backstories")
    private Occupation occupation;

    @ManyToOne
    @JsonIgnoreProperties("backstories")
    private Planet homeworld;

    @ManyToOne
    @JsonIgnoreProperties("backstories")
    private OriginDetails originDetails;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public Backstory text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Adjective getAdjective() {
        return adjective;
    }

    public Backstory adjective(Adjective adjective) {
        this.adjective = adjective;
        return this;
    }

    public void setAdjective(Adjective adjective) {
        this.adjective = adjective;
    }

    public Species getSpecies() {
        return species;
    }

    public Backstory species(Species species) {
        this.species = species;
        return this;
    }

    public void setSpecies(Species species) {
        this.species = species;
    }

    public Occupation getOccupation() {
        return occupation;
    }

    public Backstory occupation(Occupation occupation) {
        this.occupation = occupation;
        return this;
    }

    public void setOccupation(Occupation occupation) {
        this.occupation = occupation;
    }

    public Planet getHomeworld() {
        return homeworld;
    }

    public Backstory homeworld(Planet planet) {
        this.homeworld = planet;
        return this;
    }

    public void setHomeworld(Planet planet) {
        this.homeworld = planet;
    }

    public OriginDetails getOriginDetails() {
        return originDetails;
    }

    public Backstory originDetails(OriginDetails originDetails) {
        this.originDetails = originDetails;
        return this;
    }

    public void setOriginDetails(OriginDetails originDetails) {
        this.originDetails = originDetails;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Backstory)) {
            return false;
        }
        return id != null && id.equals(((Backstory) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Backstory{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
