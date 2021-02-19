package gov.cdc.usds.simplereport.db.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.NaturalId;

/**
 * A valid combination of device and specimen types. Can be soft-deleted, but
 * cannot be otherwise modified.
 */
@Entity
public class DeviceSpecimen extends EternalEntity {

    @NaturalId
    @ManyToOne(optional = false)
    @JoinColumn(name = "device_type_id", nullable = false, updatable = false)
    private DeviceType deviceType;

    @NaturalId
    @ManyToOne(optional = false)
    @JoinColumn(name = "specimen_type_id", nullable = false, updatable = false)
    private SpecimenType specimenType;

    protected DeviceSpecimen() {
    } // for hibernate

    public DeviceSpecimen(DeviceType deviceType, SpecimenType specimenType) {
        this.deviceType = deviceType;
        this.specimenType = specimenType;
    }

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public SpecimenType getSpecimenType() {
        return specimenType;
    }
}
