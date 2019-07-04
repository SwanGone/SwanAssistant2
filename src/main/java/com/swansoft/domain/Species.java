package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Species.
 */
@Entity
@Table(name = "species")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Species implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "physical_characteristics")
    private String physicalCharacteristics;

    @Column(name = "date_added")
    private Instant dateAdded;

    @Column(name = "in_circulation")
    private Boolean inCirculation;

    @OneToOne
    @JoinColumn(unique = true)
    private Remarks remarks;

    @ManyToOne
    @JsonIgnoreProperties("species")
    private User createdBy;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "species_viewable_by",
               joinColumns = @JoinColumn(name = "species_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "viewable_by_id", referencedColumnName = "id"))
    private Set<User> viewableBies = new HashSet<>();

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

    public Species name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhysicalCharacteristics() {
        return physicalCharacteristics;
    }

    public Species physicalCharacteristics(String physicalCharacteristics) {
        this.physicalCharacteristics = physicalCharacteristics;
        return this;
    }

    public void setPhysicalCharacteristics(String physicalCharacteristics) {
        this.physicalCharacteristics = physicalCharacteristics;
    }

    public Instant getDateAdded() {
        return dateAdded;
    }

    public Species dateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Boolean isInCirculation() {
        return inCirculation;
    }

    public Species inCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
        return this;
    }

    public void setInCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
    }

    public Remarks getRemarks() {
        return remarks;
    }

    public Species remarks(Remarks remarks) {
        this.remarks = remarks;
        return this;
    }

    public void setRemarks(Remarks remarks) {
        this.remarks = remarks;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public Species createdBy(User user) {
        this.createdBy = user;
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public Set<User> getViewableBies() {
        return viewableBies;
    }

    public Species viewableBies(Set<User> users) {
        this.viewableBies = users;
        return this;
    }

    public Species addViewableBy(User user) {
        this.viewableBies.add(user);
        return this;
    }

    public Species removeViewableBy(User user) {
        this.viewableBies.remove(user);
        return this;
    }

    public void setViewableBies(Set<User> users) {
        this.viewableBies = users;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Species)) {
            return false;
        }
        return id != null && id.equals(((Species) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Species{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", physicalCharacteristics='" + getPhysicalCharacteristics() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", inCirculation='" + isInCirculation() + "'" +
            "}";
    }
}
