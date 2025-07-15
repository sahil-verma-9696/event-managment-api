import { supabase } from "../lib/supabase.js";

export async function createEvent(req, res) {
  try {
    const { title, datetime, location, capacity } = req.body;

    if (!title || !datetime || !location || !capacity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (capacity <= 0 || capacity > 1000) {
      return res
        .status(400)
        .json({ error: "Capacity must be between 1 and 1000" });
    }

    const { data, error } = await supabase
      .from("events")
      .insert([{ title, datetime, location, capacity }])
      .select("id")
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({ id: data.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      return res.status(500).json({ error: findError.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }])
      .select("id")
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(201)
      .json({ id: data.id, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getEventsDetails(req, res) {
  const { id } = req.params;

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
        *,
        registrations (
          user_id,
          users (
            id,
            name,
            email
          )
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Event not found" });

  const registered_users = event.registrations.map((r) => r.users);
  delete event.registrations;

  return res.status(200).json({ ...event, registered_users });
}

export async function registerForEvent(req, res) {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "user_id and event_id are required" });
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("capacity, datetime")
    .eq("id", event_id)
    .single();

  if (eventError || !event)
    return res.status(404).json({ error: "Event not found" });

  if (new Date(event.datetime) < new Date()) {
    return res.status(400).json({ error: "Cannot register for past events" });
  }

  const { count } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event_id);

  if (count >= event.capacity) {
    return res.status(400).json({ error: "Event is full" });
  }

  const { data: existing } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .maybeSingle();

  if (existing) {
    return res.status(400).json({ error: "User already registered" });
  }

  const { error } = await supabase
    .from("registrations")
    .insert([{ user_id, event_id }]);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ success: true });
}

export async function cancellRegistration(req, res) {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "user_id and event_id are required" });
  }

  const { data: registration } = await supabase
    .from("registrations")
    .select("*")
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .maybeSingle();

  if (!registration) {
    return res
      .status(400)
      .json({ error: "User is not registered for this event" });
  }

  const { error } = await supabase
    .from("registrations")
    .delete()
    .eq("user_id", user_id)
    .eq("event_id", event_id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}

export async function listUpcomingEvents(req, res) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gt("datetime", new Date().toISOString())
    .order("datetime", { ascending: true })
    .order("location", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
}

export async function eventStats(req, res) {
  const { id } = req.params;

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("capacity")
    .eq("id", id)
    .single();

  if (eventError || !event)
    return res.status(404).json({ error: "Event not found" });

  const { count } = await supabase
    .from("registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  const remaining = event.capacity - count;
  const percentageUsed = ((count / event.capacity) * 100).toFixed(2);

  return res.status(200).json({
    total_registrations: count,
    remaining_capacity: remaining,
    percentage_used: Number(percentageUsed),
  });
}
