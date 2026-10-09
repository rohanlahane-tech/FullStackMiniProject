package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.Model.User;
import com.example.demo.Repository.Repo;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class MyController {

    @Autowired
    Repo UserRepo;

    @PostMapping
    public User Postmessage(@RequestBody User u1) {

        User newusers = new User();

        newusers.setId(u1.getId());
        newusers.setUsername(u1.getUsername());
        newusers.setPassword(u1.getPassword());
        newusers.setEmail(u1.getEmail());
        newusers.setMobile(u1.getMobile());

        User postdata = UserRepo.save(newusers);

        return postdata;
    }
    
    @GetMapping("/all")
public Iterable<User> GetAllUsers() {
    return UserRepo.findAll();
}
    @GetMapping("/{Id}")
    public User Getmessage(@PathVariable Integer Id) throws Exception {

        Optional<User> u1 = UserRepo.findById(Id);

        if (u1.isPresent()) {
            return u1.get();
        }

        throw new Exception("User Not Found!");
    }

    @PutMapping("/{Id}")
    public User Updatedata(@RequestBody User u2,
                           @PathVariable Integer Id) throws Exception {

        Optional<User> u1 = UserRepo.findById(Id);

        if (u1.isEmpty()) {
            throw new Exception("user Not Found!");
        }

        User olduser = u1.get();

        if (u2.getId() != null) {
            olduser.setId(u2.getId());
        }

        if (u2.getUsername() != null) {
            olduser.setUsername(u2.getUsername());
        }

        if (u2.getPassword() != null) {
            olduser.setPassword(u2.getPassword());
        }

        if (u2.getEmail() != null) {
            olduser.setEmail(u2.getEmail());
        }

        if (u2.getMobile() != null) {
            olduser.setMobile(u2.getMobile());
        }

        User Updatedata = UserRepo.save(olduser);

        return Updatedata;
    }


@DeleteMapping("/{Id}")
public String DeleteUser(@PathVariable Integer Id) {
    if (!UserRepo.existsById(Id)) {
        return "User Not Found!";
    }

    UserRepo.deleteById(Id);
    return "User Deleted Successfully!";
}

}