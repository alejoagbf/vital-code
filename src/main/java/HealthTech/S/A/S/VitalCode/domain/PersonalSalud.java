package HealthTech.S.A.S.VitalCode.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("PERSONAL_SALUD")
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PersonalSalud extends Usuario {

    @Column(name = "cargo")
    private String cargo ;

    @Column(name = "numero_Licencia", unique = true)
    private Long numLicencia ;

    @Column(name = "institucion")
    private String institucion ;

}
