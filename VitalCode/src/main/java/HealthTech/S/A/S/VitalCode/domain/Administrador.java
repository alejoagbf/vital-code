package HealthTech.S.A.S.VitalCode.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("ADMINISTRADOR")
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Administrador extends Usuario{

    @Column(name = "departamento")
    private String departamento ;




}
