const Address = require("../Models/Address");
const asyncHandler = require("../Middleware/asyncHandler");

exports.addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone, house, street, city, state, pincode, landmark, isDefault } = req.body;

  // If new address is default, unset previous default
  if (isDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    userId,
    name,
    phone,
    house,
    street,
    city,
    state,
    pincode,
    landmark,
    isDefault: !!isDefault
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});

/**
 * Get all active addresses for user
 */
exports.getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({
    userId: req.user.id,
    isActive: true,
  }).sort({ isDefault: -1, createdAt: -1 });

  res.json({ success: true, addresses });
});

/**
 * Update address
 */
exports.updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;
  const { name, phone, house, street, city, state, pincode, landmark, isDefault } = req.body;

  const address = await Address.findOne({
    _id: addressId,
    userId,
    isActive: true,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  // Handle default switch
  if (isDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { isDefault: false }
    );
  }

  address.name = name || address.name;
  address.phone = phone || address.phone;
  address.house = house || address.house;
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.pincode = pincode || address.pincode;
  address.landmark = landmark || address.landmark;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

  await address.save();

  res.json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

/**
 * Set default address
 */
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  await Address.updateMany(
    { userId, isDefault: true },
    { isDefault: false }
  );

  const address = await Address.findOneAndUpdate(
    { _id: addressId, userId, isActive: true },
    { isDefault: true },
    { new: true }
  );

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.json({
    message: "Default address updated",
    address,
  });
});

/**
 * Soft delete address
 */
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { isActive: false },
    { new: true }
  );

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.json({ message: "Address removed successfully" });
});
