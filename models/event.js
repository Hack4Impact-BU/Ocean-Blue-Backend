const mongoose = require('mongoose');

const eventSchema = {
    eventCreator: String,
    title: String,
    date: String,
    description: String,
    address: String,
    latitude: Number,
    longitude: Number,
    garbageCollected: [
        {
            name: {
                type: String,
                enum: {
                    values: [
                        "PLASTIC_FILM",
                        "PLASTIC_FOAM",
                        "PLASTIC_HARD",
                        "PLASTIC_BAG",
                        "PLASTIC_BEVERAGE_BOTTLE",
                        "PLASTIC_BOTTLE_CAP",
                        "PLASTIC_CUP",
                        "PLASTIC_FOOD_WRAPPER",
                        "PLASTIC_JUG_AND_CONTAINER",
                        "PLASTIC_STRAW",
                        "PLASTIC_UTENSIL",
                        "PLASTIC_6_PACK_RING",
                        "PLASTIC_CIGAR_TIP",
                        "PLASTIC_CIGARETTE_BUTT",
                        "PLASTIC_LIGHTER",
                        "PLASTIC_BUOY_AND_FLOAT",
                        "PLASTIC_LURE_AND_LINE",
                        "PLASTIC_ROPE_AND_NET",
                        "PLASTIC_BALLOON",
                        "PLASTIC_PERSONAL_CARE",
                        "PLASTIC_SHOTGUN_SHELL_AND_WAD",
                        "PLASTIC_OTHER",
                        "METAL_FRAGMENT",
                        "METAL_AEROSOL_CAN",
                        "METAL_ALUMINUM_CAN",
                        "METAL_OTHER",
                        "GLASS_FRAGMENT",
                        "GLASS_BEVERAGE_BOTTLE",
                        "GLASS_JAR",
                        "GLASS_OTHER",
                        "RUBBER_FRAGMENT",
                        "RUBBER_BALLOON",
                        "RUBBER_FLIP_FLOP",
                        "RUBBER_GLOVE",
                        "RUBBER_TIRE",
                        "RUBBER_OTHER",
                        "PROCESSED_WOOD_CARBOARD_CARTON",
                        "PROCESSED_WOOD_LUMBER_AND_BUILDING",
                        "PROCESSED_WOOD_PAPER_AND_CARBOARD",
                        "PROCESSED_WOOD_PAPER_BAG",
                        "PROCESSED_WOOD_OTHER",
                        "FABRIC_FRAGMENT",
                        "FABRIC_CLOTHING_AND_SHOE",
                        "FABRIC_FACE_MASK",
                        "FABRIC_GLOVE",
                        "FABRIC_ROPE_AND_NET",
                        "FABRIC_TOWEL_AND_RAG",
                        "FABRIC_OTHER",
                        "OTHER_FIREWORK",
                        "OTHER_LEATHER_BELT",
                        "OTHER_ASPHALT_CHUNK"
                    ],
                    message: "{VALUE} is not supported"
                }
            }, 
            amount: {
                type: Number, 
                min: 0
            }
        }
    ],
    isPublic: Boolean,
    volunteers: Array,
    imageAzureURIs: Array
}

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;