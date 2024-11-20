<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal">
            <h2>Új verzió</h2>
            <p>Csekkold le az új verziót a <a href="https://v2.ranzak.site" target="_blank">v2-es oldalon</a>. (Telefonról nem működik)</p>
            <div class="checkbox-container">
                <input type="checkbox" id="notmore" v-model="notmore">
                <label for="notmore">Nem akarom többet látni</label>
            </div>
            <button @click="closeModal">Bezárás</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const showModal = ref(true);
const notmore = ref(false);

if (useCookie('version2').value === 'dismissed') {
    showModal.value = false;
}

const closeModal = () => {
    if (notmore.value) {
        useCookie('version2', { expires: new Date('2025-12-31') }).value = 'dismissed';
    }
    showModal.value = false;
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    display: flex;
    flex-direction: column;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    text-align: center;
    position: relative;
}

.modal h2 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    color: #333;
}

.modal p {
    margin-bottom: 15px;
    color: #555;
    line-height: 1.4;
}

.checkbox-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #666;
}

.checkbox-container input[type="checkbox"] {
    margin-right: 8px;
    cursor: pointer;
}

button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

button:focus {
    outline: none;
    box-shadow: 0 0 5px #007BFF;
}
</style>