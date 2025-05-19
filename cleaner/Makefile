BINARY_NAME = cleaner
BUILD_DIR = .
TARGET = $(BUILD_DIR)/$(BINARY_NAME)

.PHONY: all clean

all:
	cargo build --release
	rm -f $(TARGET)
	cp target/release/$(BINARY_NAME) $(TARGET)
	rm -rf target

clean:
	cargo clean
	rm -f $(TARGET)
