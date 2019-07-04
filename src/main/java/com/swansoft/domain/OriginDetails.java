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
 * A OriginDetails.
 */
@Entity
@Table(name = "origin_details")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OriginDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "date_added")
    private Instant dateAdded;

    @Column(name = "in_circulation")
    private Boolean inCirculation;

    @ManyToOne
    @JsonIgnoreProperties("originDetails")
    private User createdBy;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "origin_details_viewable_by",
               joinColumns = @JoinColumn(name = "origin_details_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "viewable_by_id", referencedColumnName = "id"))
    private Set<User> viewableBies = new HashSet<>();

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

    public OriginDetails content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getDateAdded() {
        return dateAdded;
    }

    public OriginDetails dateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Boolean isInCirculation() {
        return inCirculation;
    }

    public OriginDetails inCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
        return this;
    }

    public void setInCirculation(Boolean inCirculation) {
        this.inCirculation = inCirculation;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public OriginDetails createdBy(User user) {
        this.createdBy = user;
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public Set<User> getViewableBies() {
        return viewableBies;
    }

    public OriginDetails viewableBies(Set<User> users) {
        this.viewableBies = users;
        return this;
    }

    public OriginDetails addViewableBy(User user) {
        this.viewableBies.add(user);
        return this;
    }

    public OriginDetails removeViewableBy(User user) {
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
        if (!(o instanceof OriginDetails)) {
            return false;
        }
        return id != null && id.equals(((OriginDetails) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "OriginDetails{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", inCirculation='" + isInCirculation() + "'" +
            "}";
    }
}
