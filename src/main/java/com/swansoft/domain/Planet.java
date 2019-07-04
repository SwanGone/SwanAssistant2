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
 * A Planet.
 */
@Entity
@Table(name = "planet")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Planet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "date_added")
    private Instant dateAdded;

    @Column(name = "has_unobtainium")
    private Boolean hasUnobtainium;

    @Column(name = "in_circulation")
    private Boolean inCirculation;

    @OneToOne
    @JoinColumn(unique = true)
    private Remarks remarks;

    @ManyToOne
    @JsonIgnoreProperties("planets")
    private User createdBy;

    @ManyToOne
    @JsonIgnoreProperties("planets")
    private HexSector locatedIn;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "planet_viewable_by",
               joinColumns = @JoinColumn(name = "planet_id", referencedColumnName = "id"),
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

    public Planet name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getDateAdded() {
        return dateAdded;
    }

    public Planet dateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Boolean isHasUnobtainium() {
        return hasUnobtainium;
    }

    public Planet hasUnobtainium(Boolean hasUnobtainium) {
        this.hasUnobtainium = hasUnobtainium;
        return this;
    }

    public void setHasUnobtainium(Boolean hasUnobtainium) {
        this.hasUnobtainium = hasUnobtainium;
    }

    public Boolean isInCirculation() {
        return inCirculation;
    }

    public Planet inCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
        return this;
    }

    public void setInCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
    }

    public Remarks getRemarks() {
        return remarks;
    }

    public Planet remarks(Remarks remarks) {
        this.remarks = remarks;
        return this;
    }

    public void setRemarks(Remarks remarks) {
        this.remarks = remarks;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public Planet createdBy(User user) {
        this.createdBy = user;
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public HexSector getLocatedIn() {
        return locatedIn;
    }

    public Planet locatedIn(HexSector hexSector) {
        this.locatedIn = hexSector;
        return this;
    }

    public void setLocatedIn(HexSector hexSector) {
        this.locatedIn = hexSector;
    }

    public Set<User> getViewableBies() {
        return viewableBies;
    }

    public Planet viewableBies(Set<User> users) {
        this.viewableBies = users;
        return this;
    }

    public Planet addViewableBy(User user) {
        this.viewableBies.add(user);
        return this;
    }

    public Planet removeViewableBy(User user) {
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
        if (!(o instanceof Planet)) {
            return false;
        }
        return id != null && id.equals(((Planet) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Planet{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", hasUnobtainium='" + isHasUnobtainium() + "'" +
            ", inCirculation='" + isInCirculation() + "'" +
            "}";
    }
}
