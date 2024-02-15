const Profile = require("../Models").Profile;

const createProfile = async (req, res) => {
    try {
        // Get UserId from the logged-in user
        const userId = req.user.id;

        // Check if the user already has a profile
        const existingProfile = await Profile.findOne({ where: { UserId: userId } });
        if (existingProfile) {
            return res.status(400).send("User already has a profile");
        }

        // If the user doesn't have a profile, proceed with creating one
        const { designation, department, phoneNumber, country, state, city, address } = req.body;

        const profileData = {
            UserId: userId,
            designation,
            department,
            phoneNumber,
            country,
            state,
            city,
            address
        };

        // Save the profile data
        const profile = await Profile.create(profileData);

        return res.status(201).send(profile);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

const getProfileDetails = async (req, res) => {
    try {
        const profiles = await Profile.findAll();
        return res.status(200).send(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const updateProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const profile = await Profile.findByPk(profileId);
        if (!profile) return res.status(404).send("Profile not found");
        await Profile.update(req.body, { where: { id: profileId } });
        return res.status(200).send("Profile updated successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

const deleteProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const profile = await Profile.findByPk(profileId);
        if (!profile) return res.status(404).send("Profile not found");
        await Profile.destroy({ where: { id: profileId } });
        return res.status(200).send("Profile deleted successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { createProfile, getProfileDetails, updateProfile, deleteProfile };