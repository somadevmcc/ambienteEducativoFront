<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Timer {
    id: any;
    elapsed: number;
}

export const timers: Timer[] = [];

function startTimer() {
    const newTimer: Timer = {
        id: setInterval(() => {
            // Your timer logic here
            // For example, incrementing elapsed time
            newTimer.elapsed += 100;
            console.log('Timer', newTimer.elapsed);
        }, 100),
        elapsed: 0,
    };
    timers.push(newTimer);
}

function stopTimer(index: number) {
    if (timers[index]) {
        clearInterval(timers[index].id);
        timers.splice(index, 1);
    }
}

function resetTimer(index: number) {
    if (timers[index]) {
        clearInterval(timers[index].id);
        timers[index].elapsed = 0;
    }
}

onDestroy(() => {
    timers.forEach((timer) => {
        clearInterval(timer.id);
    });
    timers.length = 0;
});
</script>