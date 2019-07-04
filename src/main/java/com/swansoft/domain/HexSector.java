package com.swansoft.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A HexSector.
 */
@Entity
@Table(name = "hex_sector")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class HexSector implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "hex_row")
    private String hexRow;

    @Column(name = "hex_column")
    private String hexColumn;

    @Column(name = "coordinates")
    private String coordinates;

    @Column(name = "is_mapped")
    private Boolean isMapped;

    @ManyToOne
    @JsonIgnoreProperties("hexSectors")
    private HexMap locatedIn;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHexRow() {
        return hexRow;
    }

    public HexSector hexRow(String hexRow) {
        this.hexRow = hexRow;
        return this;
    }

    public void setHexRow(String hexRow) {
        this.hexRow = hexRow;
    }

    public String getHexColumn() {
        return hexColumn;
    }

    public HexSector hexColumn(String hexColumn) {
        this.hexColumn = hexColumn;
        return this;
    }

    public void setHexColumn(String hexColumn) {
        this.hexColumn = hexColumn;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public HexSector coordinates(String coordinates) {
        this.coordinates = coordinates;
        return this;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public Boolean isIsMapped() {
        return isMapped;
    }

    public HexSector isMapped(Boolean isMapped) {
        this.isMapped = isMapped;
        return this;
    }

    public void setIsMapped(Boolean isMapped) {
        this.isMapped = isMapped;
    }

    public HexMap getLocatedIn() {
        return locatedIn;
    }

    public HexSector locatedIn(HexMap hexMap) {
        this.locatedIn = hexMap;
        return this;
    }

    public void setLocatedIn(HexMap hexMap) {
        this.locatedIn = hexMap;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HexSector)) {
            return false;
        }
        return id != null && id.equals(((HexSector) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "HexSector{" +
            "id=" + getId() +
            ", hexRow='" + getHexRow() + "'" +
            ", hexColumn='" + getHexColumn() + "'" +
            ", coordinates='" + getCoordinates() + "'" +
            ", isMapped='" + isIsMapped() + "'" +
            "}";
    }
}
