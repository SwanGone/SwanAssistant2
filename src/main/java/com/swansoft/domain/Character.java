package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Character.
 */
@Entity
@Table(name = "character")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Character implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "in_circulation")
    private Boolean inCirculation;

    @Column(name = "is_most_current")
    private Boolean isMostCurrent;

    @Column(name = "is_player_character")
    private Boolean isPlayerCharacter;

    @Column(name = "is_diplomat")
    private Boolean isDiplomat;

    @OneToOne
    @JoinColumn(unique = true)
    private Backstory origin;

    @OneToOne
    @JoinColumn(unique = true)
    private Remarks remarks;

    @ManyToOne
    @JsonIgnoreProperties("characters")
    private User createdBy;

    @ManyToOne
    @JsonIgnoreProperties("characters")
    private Planet currentLocation;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "character_viewable_by",
               joinColumns = @JoinColumn(name = "character_id", referencedColumnName = "id"),
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

    public Character name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isInCirculation() {
        return inCirculation;
    }

    public Character inCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
        return this;
    }

    public void setInCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
    }

    public Boolean isIsMostCurrent() {
        return isMostCurrent;
    }

    public Character isMostCurrent(Boolean isMostCurrent) {
        this.isMostCurrent = isMostCurrent;
        return this;
    }

    public void setIsMostCurrent(Boolean isMostCurrent) {
        this.isMostCurrent = isMostCurrent;
    }

    public Boolean isIsPlayerCharacter() {
        return isPlayerCharacter;
    }

    public Character isPlayerCharacter(Boolean isPlayerCharacter) {
        this.isPlayerCharacter = isPlayerCharacter;
        return this;
    }

    public void setIsPlayerCharacter(Boolean isPlayerCharacter) {
        this.isPlayerCharacter = isPlayerCharacter;
    }

    public Boolean isIsDiplomat() {
        return isDiplomat;
    }

    public Character isDiplomat(Boolean isDiplomat) {
        this.isDiplomat = isDiplomat;
        return this;
    }

    public void setIsDiplomat(Boolean isDiplomat) {
        this.isDiplomat = isDiplomat;
    }

    public Backstory getOrigin() {
        return origin;
    }

    public Character origin(Backstory backstory) {
        this.origin = backstory;
        return this;
    }

    public void setOrigin(Backstory backstory) {
        this.origin = backstory;
    }

    public Remarks getRemarks() {
        return remarks;
    }

    public Character remarks(Remarks remarks) {
        this.remarks = remarks;
        return this;
    }

    public void setRemarks(Remarks remarks) {
        this.remarks = remarks;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public Character createdBy(User user) {
        this.createdBy = user;
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public Planet getCurrentLocation() {
        return currentLocation;
    }

    public Character currentLocation(Planet planet) {
        this.currentLocation = planet;
        return this;
    }

    public void setCurrentLocation(Planet planet) {
        this.currentLocation = planet;
    }

    public Set<User> getViewableBies() {
        return viewableBies;
    }

    public Character viewableBies(Set<User> users) {
        this.viewableBies = users;
        return this;
    }

    public Character addViewableBy(User user) {
        this.viewableBies.add(user);
        return this;
    }

    public Character removeViewableBy(User user) {
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
        if (!(o instanceof Character)) {
            return false;
        }
        return id != null && id.equals(((Character) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Character{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", inCirculation='" + isInCirculation() + "'" +
            ", isMostCurrent='" + isIsMostCurrent() + "'" +
            ", isPlayerCharacter='" + isIsPlayerCharacter() + "'" +
            ", isDiplomat='" + isIsDiplomat() + "'" +
            "}";
    }
}
