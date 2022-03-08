package gov.cdc.usds.simplereport.db.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConstructorBinding;

/** A disease that SimpleReport supports testing for. */
@Entity
@NoArgsConstructor
@Getter
public class SupportedDisease extends IdentifiedEntity {

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String loinc;

  @ManyToMany
  @JoinTable(
      name = "device_supported_disease",
      joinColumns = @JoinColumn(name = "supported_disease_id"),
      inverseJoinColumns = @JoinColumn(name = "device_type_id"))
  private Set<DeviceType> deviceTypes = new HashSet<>();

  @ConstructorBinding
  public SupportedDisease(String name, String loinc) {
    this();
    this.name = name;
    this.loinc = loinc;
  }

  public void addDevice(DeviceType deviceType) {
    this.deviceTypes.add(deviceType);
  }

  public Set<DeviceType> getDevices() {
    return this.deviceTypes;
  }
}
