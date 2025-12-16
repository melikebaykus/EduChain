package com.educhain.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CSRF kapalı (Angular + REST için gerekli)
                .csrf(csrf -> csrf.disable())

                // H2 console için frame izni (opsiyonel ama zararsız)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Şimdilik tüm endpoint'ler açık (geliştirme ortamı)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll()
                )

                // Login mekanizmaları kapalı
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
