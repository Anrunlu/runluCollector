import platform
import atexit
from logging import Logger
from flask import Flask, request, jsonify
from flask_apscheduler import APScheduler
from service import dingChatBot
from service import msgTemplate
from service import db


class Config(object):
    SCHEDULER_API_ENABLED = True


scheduler = APScheduler()

# 定时任务
@scheduler.task("interval", id="do_job_1", minutes=30, misfire_grace_time=900)
def job1():
    print('定时任务执行')
    clts = db.get_nearlyEnd_tasks()
    send_clt_nearly_end_notice(clts)


app = Flask(__name__)
app.config.from_object(Config())

scheduler.init_app(app)

logger = Logger('logger')

if platform.system() != 'Windows':
    fcntl = __import__("fcntl")
    f = open("scheduler.lock", "wb")
    try:
        fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        scheduler.start()
        logger.debug("Scheduler Started...")
    except Exception as e:
        logger.error('Exit the scheduler, error - {}'.format(e))
        scheduler.shutdown()
    def unlock():
        fcntl.flock(f, fcntl.LOCK_UN)
        f.close()
    atexit.register(unlock)
else:
    msvcrt = __import__("msvcrt")
    f = open("scheduler.lock", "wb")
    try:
        msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        scheduler.start()
        logger.debug("Scheduler Started...")
    except Exception as e:
        logger.error('Exit the scheduler, error - {}'.format(e))
        scheduler.shutdown()
    def _unlock_file():
        try:
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
        except IOError:
            raise
    atexit.register(_unlock_file)


# scheduler.start()

@app.route("/cltNotice", methods=["POST"])
def send_new_clt_notice():
    data = request.get_json()
    cltId = data["cltId"]
    groupId = data["groupId"]
    msgType = data["msgType"]

    clt = db.get_clt(cltId)
    group = db.get_group(groupId)

    msg = None
    if msgType == 'newClt':
        if clt["property"] == "private":
            msg = msgTemplate.new_private_clt(clt)
        else:
            msg = msgTemplate.new_public_clt(clt)
    else:
        if clt["property"] == "private":
            msg = msgTemplate.remind_private_clt(clt)
        else:
            msg = msgTemplate.remind_public_clt(clt)

    dingChatBot.send_msg(group["ddwebhook"], group["ddsecret"], msg)

    return jsonify({"success": True})



def send_clt_nearly_end_notice(clts):
    for clt in clts:
        webhook = clt['groups'][0]['ddwebhook']
        secret = clt['groups'][0]['ddsecret']
        msg = None
        if clt["property"] == "private":
            msg = msgTemplate.nearly_end_private_clt(clt)
        else:
            msg = msgTemplate.nearly_end_public_clt(clt)
        dingChatBot.send_msg(webhook, secret, msg)


# if __name__ == "__main__":
#     app.run(host='127.0.0.1', port=5001)
