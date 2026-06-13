class Midi3ByteBuffer {
  constructor(messageCapacity = 4096) {
    // Capacity must be a power of 2 for the fast bitwise wrapping mask
    this.capacity = messageCapacity;
    this.mask = messageCapacity - 1;
    // Each message takes 3 bytes (Status, Note, Velocity)
    this.buffer = new Uint8Array(this.capacity * 3);
    this.head = 0; // Tracks number of written messages
    this.tail = 0; // Tracks number of read messages
  }

  // Push raw 3-byte data with zero memory allocations
  push(status, note, velocity) {
    // Get the structural index starting point for this 3-byte chunk
    const msgIdx = (this.head & this.mask) * 3;
    this.buffer[msgIdx]     = status;
    this.buffer[msgIdx + 1] = note;
    this.buffer[msgIdx + 2] = velocity;
    this.head++;
    // Prevent buffer overflow (head cannot lap tail)
    if (this.head - this.tail > this.capacity) {
      this.tail = this.head - this.capacity;
    }
  }

  // Push directly using WebMidi's underlying Uint8Array
  pushRawArray(uint8Array) {
    this.push(uint8Array[0], uint8Array[1], uint8Array[2]);
  }

  // Process all unread messages inline without creating new arrays
  processUnread(callback) {
    while (this.tail < this.head) {
      const msgIdx = (this.tail & this.mask) * 3;
      // Extract raw byte values directly out of the flat memory
      callback(
        this.buffer[msgIdx],     // Status Byte
        this.buffer[msgIdx + 1], // Note Number
        this.buffer[msgIdx + 2]  // Velocity
      );
      this.tail++;
    }
  }

  clear() {
    this.head = 0;
    this.tail = 0;
  }
}

export default Midi3ByteBuffer;