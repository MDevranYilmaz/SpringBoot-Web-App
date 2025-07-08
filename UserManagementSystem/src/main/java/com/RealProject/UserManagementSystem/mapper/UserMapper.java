package com.RealProject.UserManagementSystem.mapper;

import com.RealProject.UserManagementSystem.dto.UserDTO;
import com.RealProject.UserManagementSystem.entity.User;

public class UserMapper {
    public static UserDTO userToDTO(User user) {
        return new UserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getUsername(),
                user.getPassword(), user.getTitle(), user.getDepartment(), user.getRole());
    }

}
