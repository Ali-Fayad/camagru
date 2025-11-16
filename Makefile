PHP=php
PHP_BUILTIN_SERVER_CMD=$(PHP) -S 127.0.0.1:8000 -t Server/public

.PHONY: all init_db server run clean

all: init_db run

# Create DB (if not exists)
init_db:
	$(PHP) Server/config/init_db.php

# Start PHP built‑in server after ensuring DB exists
run: init db
	$(PHP_BUILTIN_SERVER_CMD)

# Alias
server: run

clean:
	@echo "Nothing to clean."
